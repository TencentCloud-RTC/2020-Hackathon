using Aspose.Words.Saving;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.UI.LiveRoom
{
    /// <summary>
    /// <para>功能：白板文件类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.03.28</para>
    /// </summary>
    public abstract class BoardFile
    {
        public string Path { get; set; }

        public string Suffix { get; set; }

        public abstract List<System.Drawing.Image> ImageList { get; }

        public static BoardFile Create(string path)
        {
            try
            {
                BoardFile file = null;
                string suffix = path.Substring(path.LastIndexOf('.')).ToLower();
                if (suffix.Equals(".docx"))
                {
                    file = new WordBoardFile(path);
                }
                if (suffix.Equals(".doc"))
                {
                    file = new WordBoardFile(path);
                }
                if (suffix.Equals(".pptx"))
                {
                    file = new PPTBoardFile(path);
                }
                if (suffix.Equals(".pdf"))
                {
                    file = new PDFBoardFile(path);
                }
                if (file != null)
                {
                    file.Path = path;
                    file.Suffix = suffix;
                }
                return file;
            }
            catch
            {
                return null;
            }
        }
    }

    public class WordBoardFile : BoardFile
    {
        private List<System.Drawing.Image> _imageList;
        public override List<System.Drawing.Image> ImageList
        {
            get
            {
                return this._imageList;
            }
        }

        public WordBoardFile(string path)
        {
            this._imageList = new List<System.Drawing.Image>();
            MemoryStream memoryStream = null;
            try
            {
                Aspose.Words.Document document = new Aspose.Words.Document(path);
                int count = document.PageCount;
                ImageSaveOptions iso = null;
                System.Drawing.Image img = null;
                for (int i = 0; i < count; i++)
                {
                    iso = new ImageSaveOptions(Aspose.Words.SaveFormat.Jpeg);
                    iso.Resolution = 128;
                    iso.PrettyFormat = true;
                    iso.UseAntiAliasing = true;
                    iso.PageIndex = i;
                    memoryStream = new MemoryStream();
                    document.Save(memoryStream, iso);
                    img = System.Drawing.Image.FromStream(memoryStream);
                    this._imageList.Add(img);
                }
            }
            catch(Exception ex)
            {
                //todo
            }
            if (memoryStream != null)
            {
                memoryStream.Close();
            }
        }
    }

    public class PDFBoardFile : BoardFile
    {
        private List<System.Drawing.Image> _imageList;
        public override List<System.Drawing.Image> ImageList
        {
            get
            {
                return this._imageList;
            }
        }

        public PDFBoardFile(string path)
        {
            this._imageList = new List<System.Drawing.Image>();
            MemoryStream memoryStream = null;
            try
            {
                Aspose.Pdf.Document document = null;
                Aspose.Pdf.Devices.Resolution reso = null;
                Aspose.Pdf.Devices.JpegDevice jpegDevice = null;
                document = new Aspose.Pdf.Document(path);
                int count = document.Pages.Count;
                System.Drawing.Image img = null;
                for (int i = 0; i < count; i++)
                {
                    memoryStream = new MemoryStream();
                    reso = new Aspose.Pdf.Devices.Resolution(128);
                    jpegDevice = new Aspose.Pdf.Devices.JpegDevice(reso, 100);
                    jpegDevice.Process(document.Pages[i + 1], memoryStream);
                    img = System.Drawing.Image.FromStream(memoryStream);
                    this._imageList.Add(img);
                }
            }
            catch (Exception ex)
            {
                //todo
            }
            if (memoryStream != null)
            {
                memoryStream.Close();
            }
        }
    }

    public class PPTBoardFile : BoardFile
    {
        private List<System.Drawing.Image> _imageList;
        public override List<System.Drawing.Image> ImageList
        {
            get
            {
                return this._imageList;
            }
        }

        public PPTBoardFile(string path)
        {
            this._imageList = new List<System.Drawing.Image>();
            MemoryStream memoryStream = null;
            try
            {
                Aspose.Slides.Presentation presentation = new Aspose.Slides.Presentation(path);
                MemoryStream stream = new MemoryStream();
                presentation.Save(stream, Aspose.Slides.Export.SaveFormat.Pdf);
                Aspose.Pdf.Document document = new Aspose.Pdf.Document(stream);
                Aspose.Pdf.Devices.Resolution reso = null;
                Aspose.Pdf.Devices.JpegDevice jpegDevice = null;
                int count = document.Pages.Count;
                System.Drawing.Image img = null;
                for (int i = 0; i < count; i++)
                {
                    memoryStream = new MemoryStream();
                    reso = new Aspose.Pdf.Devices.Resolution(128);
                    jpegDevice = new Aspose.Pdf.Devices.JpegDevice(reso, 100);
                    jpegDevice.Process(document.Pages[i + 1], memoryStream);
                    img = System.Drawing.Image.FromStream(memoryStream);
                    this._imageList.Add(img);
                }
                stream.Close();
            }
            catch (Exception ex)
            {
                //todo
            }
            if (memoryStream != null)
            {
                memoryStream.Close();
            }
        }
    }
}
