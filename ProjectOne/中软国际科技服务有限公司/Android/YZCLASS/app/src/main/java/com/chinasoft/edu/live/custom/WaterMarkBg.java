package com.chinasoft.edu.live.custom;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.drawable.Drawable;

import androidx.annotation.IntRange;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * 作者：young on 2020-03-12 15:58
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class WaterMarkBg extends Drawable {

    private Paint paint = new Paint();
    private String label;
    private Context context;
    private int degress;//角度
    private int fontSize;//字体大小 单位sp

    private int transparent;
    /**
     * 初始化构造
     * @param context 上下文
     * @param label 水印文字
     * @param degress 水印角度
     * @param fontSize 水印文字大小
     */
    public WaterMarkBg(Context context,String label,int degress,int fontSize) {
        this.label = label;
        this.context = context;
        this.degress = degress;
        this.fontSize = fontSize;
    }
    public WaterMarkBg(Context context,String label,int degress,int fontSize,int transparent) {
        this.label = label;
        this.context = context;
        this.degress = degress;
        this.fontSize = fontSize;
        this.transparent = transparent;
    }

    @Override
    public void draw(@NonNull Canvas canvas) {

        int width = getBounds().right;
        int height = getBounds().bottom;

        canvas.drawColor(Color.parseColor("#00000000"));
//        paint.setColor(Color.parseColor("#613435"));

        int alpha = 255*(1 - transparent/100);
        paint.setColor(Color.argb(alpha,97,52,53));

        paint.setAntiAlias(true);
        paint.setTextSize(sp2px(context,fontSize));
        canvas.save();
        canvas.rotate(degress);
//        float textWidth = paint.measureText(label);

        double random = Math.random();
        double positionx = width*random;
        double positiony =  height * random;


        canvas.drawText(label, (float) positionx, (float) positiony, paint);

        canvas.restore();
    }

    @Override
    public void setAlpha(@IntRange(from = 0, to = 255) int alpha) {

    }

    @Override
    public void setColorFilter(@Nullable ColorFilter colorFilter) {

    }

    @Override
    public int getOpacity() {
        return PixelFormat.UNKNOWN;
    }


    public static int sp2px(Context context, float spValue) {
        final float fontScale = context.getResources().getDisplayMetrics().scaledDensity;
        return (int) (spValue * fontScale + 0.5f);
    }


}
