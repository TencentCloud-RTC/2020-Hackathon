package com.chinasoft.edu.live.api;

import com.chinasoft.edu.live.utils.LogUtils;
import com.google.gson.Gson;
import com.google.gson.TypeAdapter;

import java.io.IOException;

import okhttp3.ResponseBody;
import retrofit2.Converter;

/**
 * 作者：young on 2019/3/22 17:04
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
class CustomGsonResponseConverter<T> implements Converter<ResponseBody, T> {

    private final Gson gson;
    private final TypeAdapter<T> adapter;

    CustomGsonResponseConverter(Gson gson, TypeAdapter<T> adapter) {
        this.gson = gson;
        this.adapter = adapter;
    }

    @Override
    public T convert(ResponseBody value) throws IOException {
        String body = value.string();
        LogUtils.e("response__:"+body);
        return adapter.fromJson(body);
    }
}
