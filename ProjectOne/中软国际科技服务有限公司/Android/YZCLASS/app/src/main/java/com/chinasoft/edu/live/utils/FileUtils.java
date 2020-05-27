package com.chinasoft.edu.live.utils;

import android.os.Environment;

import com.chinasoft.edu.live.base.ChinasoftApp;

import java.io.File;
import java.io.IOException;

/**
 * 作者：young on 2019-12-16 11:40
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class FileUtils {

    //检查SDCard存在并且可以读写
    public static boolean isSDCardState() {
        return Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED);
    }

    /**
     * 判断文件是否已经存在
     *
     * @param fileName 要检查的文件名
     * @return boolean, true表示存在，false表示不存在
     */
    public static boolean isFileExist(String fileName) {
        File file = new File("绝对路径" + fileName);
        return file.exists();
    }



    public static String getLogcatPath() {
        String filePath = getAppRootPath() + "/logcatPath/";
        File file = new File(filePath);
        if (!file.isDirectory()) {
            file.mkdirs();
        }
        file = null;
        return filePath;
    }

    /**
     * @return String 返回类型
     * @throws
     * @Title: getAppRootPath
     * @Description: 获取文件储存根目录
     */
    private static String getAppRootPath() {
        String filePath = "/chinasoft/";
        if (Environment.getExternalStorageState().equals(
                Environment.MEDIA_MOUNTED)) {
            filePath = Environment.getExternalStorageDirectory() + filePath;
        } else {
            filePath = ChinasoftApp.getAppContext().getCacheDir() + filePath;
        }
        File file = new File(filePath);
        if (!file.exists()) {
            file.mkdirs();
        }
        file = null;
        File nomedia = new File(filePath + "/.nomedia");
        if (!nomedia.exists())
            try {
                nomedia.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        return filePath;
    }

    public static String getNewPath(String path) {
        String filePath = getAppRootPath() + path + "/";
        File file = new File(filePath);
        if (!file.isDirectory()) {
            file.mkdirs();
        }
        file = null;
        return filePath;
    }

    public static String getDownLoadPath() {
        String filePath = getAppRootPath() + "dowanload/";
        File file = new File(filePath);
        if (!file.isDirectory()) {
            file.mkdirs();
        }
        file = null;
        return filePath;
    }
    public static String getTxDownLoadPath() {
        String filePath = getAppRootPath() + "dowanload";
        File file = new File(filePath);
        if (!file.isDirectory()) {
            file.mkdirs();
        }
        file = null;
        return filePath;
    }

    public static String getImageCompressPath() {
        String filePath = getAppRootPath() + "imagecompress/";
        File file = new File(filePath);
        if (!file.isDirectory()) {
            file.mkdirs();
        }
        file = null;
        return filePath;
    }

}