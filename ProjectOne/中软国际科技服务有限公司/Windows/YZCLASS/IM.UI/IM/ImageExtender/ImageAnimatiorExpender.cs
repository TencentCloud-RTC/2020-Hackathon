using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Media;

namespace IM.ImageExtender
{
    public class ImageAnimatiorExpender
    {
        /// <devdoc> 
        ///     A list of images to be animated.
        /// </devdoc> 
        static List<ImageInfoExpender> imageInfoList;

        /// <devdoc> 
        ///     A variable to flag when an image or images need to be updated due to the selection of a new frame
        ///     in an image.  We don't need to synchronize access to this variable, in the case it is true we don't
        ///     do anything, otherwise the worse case is where a thread attempts to update the image's frame after
        ///     another one did which is harmless. 
        /// </devdoc>
        static bool anyFrameDirty;

        /// <devdoc>
        ///     The thread used for animating the images. 
        /// </devdoc>
        static Thread animationThread;

        /// <devdoc> 
        ///     Lock that allows either concurrent read-access to the images list for multiple threads, or write-
        ///     access to it for a single thread.  Observe that synchronization access to image objects are done 
        ///     with critical sections (lock). 
        /// </devdoc>
        static ReaderWriterLock rwImgListLock = new ReaderWriterLock();

        /// <devdoc>
        ///     Flag to avoid a deadlock when waiting on a write-lock and a an attemp to acquire a read-lock is
        ///     made in the same thread. The following comments are from WeiWen Liu (CLR team): 
        ///     <[....]: If RWLock is currently owned by another thread, the current thread is going to wait on an
        ///     event using CoWaitForMultipleHandles while pumps message/>. 
        ///     The comment above refers to the COM STA message pump, not to be confused with the UI message pump. 
        ///     However, the effect is the same, the COM message pump will pump messages and dispatch them to the
        ///     window while waiting on the writer lock; this has the potential of creating a re-entrancy situation 
        //      that if during the message processing a wait on a reader lock is originated the thread will be block
        //      on itself - see call stack attached to VSW#465562.
        ///     <[....]: While processing STA message, the thread may call back into managed code. We do this because
        ///     we can not block finalizer thread.  Finalizer thread may need to release STA objects on this thread. If 
        ///     the current thread does not pump message, finalizer thread is blocked, and AD  unload is blocked while
        ///     waiting for finalizer thread. RWLock is a fair lock. If a thread waits for a writer lock, then it needs 
        ///     a reader lock while pumping message, the thread is blocked forever/>. 
        ///     See Bug VSW#364535 which was due to the above situation.
        /// 
        ///     This TLS variable is used to flag the above situation and avoid the deadlock, it is ThreadStatic so each
        ///     thread calling into ImageAnimator is garded against this problem.
        /// </devdoc>
        [ThreadStatic]
        static int threadWriterLockWaitCount;

        /// <devdoc> 
        ///     Prevent instantiation of this class.
        /// </devdoc> 
        private ImageAnimatiorExpender()
        {
        }

        /// <devdoc> 
        ///     Advances the frame in the specified image. The new frame is drawn the next time the image is rendered.
        /// </devdoc> 
        public static void UpdateFrames(Image image)
        {
            if (!anyFrameDirty || image == null || imageInfoList == null)
            {
                return;
            }

            if (threadWriterLockWaitCount > 0)
            {
                // Cannot acquire reader lock - frame update will be missed. 
                return;
            }

            // If the current thread already has the writer lock, no reader lock is acquired. Instead, the lock count on
            // the writer lock is incremented. It it already has a reader lock, the locks ref count will be incremented 
            // w/o placing the request at the end of the reader queue.

            rwImgListLock.AcquireReaderLock(Timeout.Infinite);

            try
            {
                bool foundDirty = false;
                bool foundImage = false;

                foreach (ImageInfoExpender imageInfo in imageInfoList)
                {
                    if (imageInfo.Image == image)
                    {
                        if (imageInfo.FrameDirty)
                        {
                            // See comment in the class header about locking the image ref.
                            lock (imageInfo.Image)
                            {
                                imageInfo.UpdateFrame();
                            }
                        }
                        foundImage = true;
                    }

                    if (imageInfo.FrameDirty)
                    {
                        foundDirty = true;
                    }

                    if (foundDirty && foundImage)
                    {
                        break;
                    }
                }

                anyFrameDirty = foundDirty;
            }
            finally
            {
                rwImgListLock.ReleaseReaderLock();
            }


        }

        public static ImageSource GetImageSource(Image image)
        {
            ImageSource imageSource = null;

            if (imageInfoList != null)
            {
                foreach (ImageInfoExpender imageInfo in imageInfoList)
                {
                    if (imageInfo.Image == image)
                    {
                        imageSource = imageInfo.GetCurrentImageSource();
                        break;
                    }

                }
            }

            return imageSource;
        }

        ///// <devdoc> 
        /////     Advances the frame in all images currently being animated. The new frame is drawn the next time the image is rendered.
        ///// </devdoc>
        //public static void UpdateFrames() {
        //    if (!anyFrameDirty || imageInfoList == null) { 
        //        return;
        //    } 
        //    if (threadWriterLockWaitCount > 0) { 
        //        // Cannot acquire reader lock at this time, frames update will be missed.
        //        return; 
        //    }

        //    rwImgListLock.AcquireReaderLock(Timeout.Infinite);

        //    try {
        //        foreach (GifImageInfo imageInfo in imageInfoList) { 
        //            // See comment in the class header about locking the image ref. 
        //            lock (imageInfo.Image) {
        //                imageInfo.UpdateFrame(); 
        //            }
        //        }
        //        anyFrameDirty = false;
        //    } 
        //    finally {
        //        rwImgListLock.ReleaseReaderLock(); 
        //    } 
        //}

        /// <devdoc>
        ///     Adds an image to the image manager.  If the image does not support animation this method does nothing.
        ///     This method creates the image list and spawns the animation thread the first time it is called.
        /// </devdoc> 
        public static void Animate(Image image, EventHandler onFrameChangedHandler)
        {
            if (image == null)
            {
                return;
            }

            ImageInfoExpender imageInfo = null;

            // See comment in the class header about locking the image ref.
            lock (image)
            {
                // could we avoid creating an ImageInfo object if FrameCount == 1 ?
                imageInfo = new ImageInfoExpender(image);
            }

            // If the image is already animating, stop animating it 
            StopAnimate(image, onFrameChangedHandler);

            // Acquire a writer lock to modify the image info list.  If the thread has a reader lock we need to upgrade
            // it to a writer lock; acquiring a reader lock in this case would block the thread on itself. 
            // If the thread already has a writer lock its ref count will be incremented w/o placing the request in the
            // writer queue.  See ReaderWriterLock.AcquireWriterLock method in the MSDN. 

            bool readerLockHeld = rwImgListLock.IsReaderLockHeld;
            LockCookie lockDowngradeCookie = new LockCookie();

            threadWriterLockWaitCount++;

            try
            {
                if (readerLockHeld)
                {
                    lockDowngradeCookie = rwImgListLock.UpgradeToWriterLock(Timeout.Infinite);
                }
                else {
                    rwImgListLock.AcquireWriterLock(Timeout.Infinite);
                }
            }
            finally
            {
                threadWriterLockWaitCount--;
                Debug.Assert(threadWriterLockWaitCount >= 0, "threadWriterLockWaitCount less than zero.");
            }

            try
            {
                if (imageInfo.Animated)
                {
                    // Construct the image array
                    //
                    if (imageInfoList == null)
                    {
                        imageInfoList = new List<ImageInfoExpender>();
                    }

                    // Add the new image 
                    //
                    imageInfo.FrameChangedHandler = onFrameChangedHandler;
                    imageInfoList.Add(imageInfo);

                    // Construct a new timer thread if we haven't already
                    // 
                    if (animationThread == null)
                    {
                        animationThread = new Thread(new ThreadStart(AnimateImages50ms));
                        animationThread.Name = typeof(ImageAnimator).Name;
                        animationThread.IsBackground = true;
                        animationThread.Start();
                    }
                }
            }
            finally
            {
                if (readerLockHeld)
                {
                    rwImgListLock.DowngradeFromWriterLock(ref lockDowngradeCookie);
                }
                else {
                    rwImgListLock.ReleaseWriterLock();
                }
            }
        }

        /// <devdoc>
        ///    Whether or not the image has multiple time-based frames. 
        /// </devdoc> 
        public static bool CanAnimate(Image image)
        {
            if (image == null)
            {
                return false;
            }

            // See comment in the class header about locking the image ref. 
            lock (image)
            {
                Guid[] dimensions = image.FrameDimensionsList;

                foreach (Guid guid in dimensions)
                {
                    FrameDimension dimension = new FrameDimension(guid);
                    if (dimension.Equals(FrameDimension.Time))
                    {
                        return image.GetFrameCount(FrameDimension.Time) > 1;
                    }
                }
            }

            return false;
        }

        /// <devdoc>
        ///     Removes an image from the image manager so it is no longer animated.
        /// </devdoc>
        public static void StopAnimate(Image image, EventHandler onFrameChangedHandler)
        {
            // Make sure we have a list of images
            if (image == null || imageInfoList == null)
            {
                return;
            }

            // Acquire a writer lock to modify the image info list - See comments on Animate() about this locking.

            bool readerLockHeld = rwImgListLock.IsReaderLockHeld;
            LockCookie lockDowngradeCookie = new LockCookie();

            threadWriterLockWaitCount++;

            try
            {
                if (readerLockHeld)
                {
                    lockDowngradeCookie = rwImgListLock.UpgradeToWriterLock(Timeout.Infinite);
                }
                else {
                    rwImgListLock.AcquireWriterLock(Timeout.Infinite);
                }
            }
            finally
            {
                threadWriterLockWaitCount--;
                Debug.Assert(threadWriterLockWaitCount >= 0, "threadWriterLockWaitCount less than zero.");
            }

            try
            {
                // Find the corresponding reference and remove it 
                for (int i = 0; i < imageInfoList.Count; i++)
                {
                    ImageInfoExpender imageInfo = imageInfoList[i];

                    if (image == imageInfo.Image)
                    {
                        if ((onFrameChangedHandler == imageInfo.FrameChangedHandler) || (onFrameChangedHandler != null && onFrameChangedHandler.Equals(imageInfo.FrameChangedHandler)))
                        {
                            imageInfoList.Remove(imageInfo);
                        }
                        break;
                    }
                }
            }
            finally
            {
                if (readerLockHeld)
                {
                    rwImgListLock.DowngradeFromWriterLock(ref lockDowngradeCookie);
                }
                else {
                    rwImgListLock.ReleaseWriterLock();
                }
            }
        }


        /// <devdoc> 
        ///     Worker thread procedure which implements the main animation loop.
        ///     NOTE: This is the ONLY code the worker thread executes, keeping it in one method helps better understand
        ///     any synchronization issues.
        ///     WARNING: Also, this is the only place where ImageInfo objects (not the contained image object) are modified, 
        ///     so no access synchronization is required to modify them.
        /// </devdoc> 
        [SuppressMessage("Microsoft.Performance", "CA1804:RemoveUnusedLocals")]
        static void AnimateImages50ms()
        {
            Debug.Assert(imageInfoList != null, "Null images list");

            while (true)
            {
                // Acquire reader-lock to access imageInfoList, elemens in the list can be modified w/o needing a writer-lock.
                // Observe that we don't need to check if the thread is waiting or a writer lock here since the thread this 
                // method runs in never acquires a writer lock.
                rwImgListLock.AcquireReaderLock(Timeout.Infinite);
                try
                {
                    for (int i = 0; i < imageInfoList.Count; i++)
                    {
                        ImageInfoExpender imageInfo = imageInfoList[i];

                        imageInfo.FrameTimer += 5;
                        if (imageInfo.FrameTimer >= imageInfo.FrameDelay(imageInfo.Frame))
                        {
                            imageInfo.FrameTimer = 0;

                            if (imageInfo.Frame + 1 < imageInfo.FrameCount)
                            {
                                imageInfo.Frame++;
                            }
                            else {
                                imageInfo.Frame = 0;
                            }

                            if (imageInfo.FrameDirty)
                            {
                                anyFrameDirty = true;
                            }
                        }
                    }
                }
                finally
                {
                    rwImgListLock.ReleaseReaderLock();
                }

                Thread.Sleep(50);
            }
        }
    }
}
