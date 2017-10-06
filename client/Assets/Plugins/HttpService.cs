using UnityEngine;
using System.Collections;
using System.Text;
using System.Net;
using System;
using System.IO;

public class HttpService
{
    const string sUserAgent = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
    const string sContentType = "application/x-www-form-urlencoded";
    const string sRequestEncoding = "ascii";
    const string sResponseEncoding = "utf-8";

    /// <summary>
    /// Post的方式发送数据
    /// </summary>
    /// <param name="data">要Post的数据</param>
    /// <param name="url">发送的url地址</param>
    /// <returns>服务器响应</returns>
    public static string Post(string data, string url)
    {
        Encoding encoding = Encoding.UTF8;
        byte[] bytesToPost = encoding.GetBytes(data);
        return PostDataToUrl(bytesToPost, url);
    }

    ///<summary>
    /// Post data到url
    ///</summary>
    ///<param name="data">要post的数据</param>
    ///<param name="url">目标url</param>
    ///<returns>服务器响应</returns>
    private static string PostDataToUrl(byte[] data, string url)
    {
        string stringResponse = string.Empty;
        HttpWebRequest httpRequest = CreateWebRequest(url);
        FileData(httpRequest, data);
        Stream responseStream = DoPostDataToUrl(httpRequest);
        using (StreamReader responseReader = new StreamReader(responseStream, Encoding.Default))
        {
            stringResponse = responseReader.ReadToEnd();
        }
        responseStream.Close();
        return stringResponse;
    }

    /// <summary>
    /// 发送post请求到服务器并读取服务器返回信息
    /// </summary>
    /// <param name="httpRequest"></param>
    /// <returns></returns>
    private static Stream DoPostDataToUrl(HttpWebRequest httpRequest)
    {
        Stream responseStream;
        try
        {
            responseStream = httpRequest.GetResponse().GetResponseStream();
        }
        catch (Exception e)
        {
            throw new ApplicationException(string.Format("POST操作发生异常：{0}", e.Message));
        }

        return responseStream;
    }

    /// <summary>
    /// 创建HttpWebRequest对象
    /// </summary>
    /// <param name="url"></param>
    /// <returns>HttpWebRequest, 如果创建失败则抛出异常</returns>
    private static HttpWebRequest CreateWebRequest(string url)
    {
        WebRequest webRequest = WebRequest.Create(url);
        HttpWebRequest httpRequest = webRequest as HttpWebRequest;
        httpRequest.UserAgent = sUserAgent;
        httpRequest.ContentType = sContentType;
        //httpRequest.Headers.Add(HttpRequestHeader.ContentEncoding, "utf-8");
        httpRequest.Method = "POST";
        if (httpRequest == null)
            throw new ApplicationException(string.Format("Invalid url string: {0}", url));
        else
            return httpRequest;
    }

    /// <summary>
    /// 填充要post的内容
    /// </summary>
    /// <param name="httpRequest"></param>
    /// <param name="data"></param>
    /// <returns></returns>
    private static void FileData(HttpWebRequest httpRequest, byte[] data)
    {
        httpRequest.ContentLength = data.Length;
        Stream requestStream = httpRequest.GetRequestStream();
        requestStream.Write(data, 0, data.Length);
        requestStream.Close();
    }
}