using System.Security.Cryptography;
using System.Text;

namespace BTSEApiSample.Common;

public static class Utils
{
    private static readonly string ApiKey;
    private static readonly string ApiSecretKey;
    private static readonly string ApiHost;
    private static readonly string WsHost;

    static Utils()
    {
        // Load .env file only once when the class is accessed for the first time.
        DotNetEnv.Env.TraversePath().Load();

        // Assign values to the static fields
        ApiKey = GetEnvironmentVariable("API_KEY");
        ApiSecretKey = GetEnvironmentVariable("API_SECRET_KEY");
        ApiHost = GetEnvironmentVariable("API_HOST");
        WsHost = GetEnvironmentVariable("WS_HOST");
    }

    private static string GetEnvironmentVariable(string key)
    {
        var value = Environment.GetEnvironmentVariable(key);
        if (string.IsNullOrWhiteSpace(value))
            throw new InvalidOperationException($"Environment variable {key} is not properly set.");
        return value;
    }

    public static string GetSpotFullUrl(string path) => $"{ApiHost}/spot{path}";
    public static string GetSpotWsUrl() => $"{WsHost}/spot";
    public static string GetFuturesFullUrl(string path) => $"{ApiHost}/futures{path}";
    public static string GetFuturesWsUrl() => $"{WsHost}/futures";
    public static string GetOssSpotWsUrl() => $"{WsHost}/oss/spot";
    public static string GetOssFuturesWsUrl() => $"{WsHost}/oss/futures";
    public static string GetOtcFullUrl(string path) => $"{ApiHost}/otc{path}";
    public static string GetOtcWsUrl() => $"{WsHost}/otc";
    
    public static Dictionary<string, string> GetHeaders(string path, string data = "")
    {
        var nonce = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var message = path + nonce + data;

        var encoding = Encoding.GetEncoding("ISO-8859-1");
        using var hmac = new HMACSHA384(encoding.GetBytes(ApiSecretKey));
        var hash = hmac.ComputeHash(encoding.GetBytes(message));
        var signature = BitConverter.ToString(hash).Replace("-", "").ToLower();

        return new Dictionary<string, string>
        {
            { "request-api", ApiKey },
            { "request-nonce", nonce.ToString() },
            { "request-sign", signature },
            { "Accept", "application/json;charset=UTF-8" },
        };
    }
}