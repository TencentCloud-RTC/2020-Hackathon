package com.chinasoft.edu.live.utils;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.JsonSyntaxException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;

/**
 * @ProjectName: Greeretail
 * @PackageName: com.gree.retail.util
 * @ClassDescribe:
 * @Author: Young
 * @CreatTime: 2019/1/14 9:44
 */
public class JsonUtils {
    private static Gson mGson = new Gson();
//	@SuppressWarnings("rawtypes")
//	private static Gson mGson = new GsonBuilder()
//    .registerTypeAdapterFactory(new NullStringToEmptyAdapterFactory())
//    .create();
    /**
     *
     * @Title: serialize
     * @Description: 对象转jsonStr
     * @param object
     * @return String 返回类型
     * @throws
     */
    public static <T> String serialize(T object) {

        return mGson.toJson(object);
    }

    /**
     *
     * @Title: deserialize
     * @Description: jsonStr转对象
     * @param json
     *            json字符串
     * @param clz
     *            class类型
     * @throws JsonSyntaxException
     * @return T 返回类型
     */
    public static <T> T deserialize(String json, Class<T> clz)
            throws JsonSyntaxException {
        return mGson.fromJson(json, clz);
    }

    /**
     *
     * @Title: deserialize
     * @Description: jsonObject转对象model
     * @param json
     *            json对象
     * @param clz
     *            class类型
     * @throws JsonSyntaxException
     *             json解析异常
     * @return T 返回类型
     */
    public static <T> T deserialize(JsonObject json, Class<T> clz)
            throws JsonSyntaxException {
        return mGson.fromJson(json, clz);
    }

    /**
     *
     * @Title: deserialize
     * @Description: jsonStr 转 集合
     * @param json
     *            json字符串
     * @param type
     *            集合类型
     * @throws JsonSyntaxException
     *             json解析异常
     * @return T 返回类型
     */
    public static <T> T deserialize(String json, Type type)
            throws JsonSyntaxException {
        return mGson.fromJson(json, type);
    }


    //		GsonBuilder gb = new GsonBuilder();
    //		gb;
    //		Gson gson = new GsonBuilder()..registerTypeAdapter(String.class, new StringConverter()).create();
    public class StringConverter implements JsonSerializer<String>,
            JsonDeserializer<String> {

        @Override
        public String deserialize(JsonElement json, Type typeOfT,
                                  JsonDeserializationContext context) throws JsonParseException {
            return json.getAsJsonPrimitive().getAsString();
        }

        @Override
        public JsonElement serialize(String src, Type typeOfSrc,
                                     JsonSerializationContext context) {
            if (src == null) {
                return new JsonPrimitive("");
            } else {
                return new JsonPrimitive(src);
            }
        }
    }


    public static String getJson(String fileName, Context context){
        StringBuilder stringBuilder = new StringBuilder();
        try {
            InputStream is = context.getAssets().open(fileName);
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(is));
            String line;
            while ((line=bufferedReader.readLine()) != null){
                stringBuilder.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return stringBuilder.toString();
    }

}
