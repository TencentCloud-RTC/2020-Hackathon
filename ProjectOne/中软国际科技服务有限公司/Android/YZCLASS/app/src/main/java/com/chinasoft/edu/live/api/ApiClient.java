package com.chinasoft.edu.live.api;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.adapter.rxjava.RxJavaCallAdapterFactory;

public class ApiClient {

    public static Retrofit mRetrofit;


    public static Retrofit retrofit() {
        if (mRetrofit == null) {
            OkHttpClient.Builder builder = new OkHttpClient.Builder();
            builder.addInterceptor(new HeaderInterceptor());
            builder.connectTimeout(20, TimeUnit.SECONDS);//设置连接超时时间
            builder.readTimeout(20, TimeUnit.SECONDS);//设置读取超时时间
            OkHttpClient okHttpClient = builder.build();

            mRetrofit = new Retrofit.Builder()
                    .baseUrl(ApiService.API_SERVER_URL)
                    //可以打印返回json的创建器
                    .addConverterFactory(CustomGsonConverterFactory.create())
//                    .addConverterFactory(GsonConverterFactory.create())
                    .addCallAdapterFactory(RxJavaCallAdapterFactory.create())
                    .client(okHttpClient)  
                    .build();
        }
        return mRetrofit;
    }




}
