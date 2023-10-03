using System.Text.Json.Serialization;

namespace FutureCancelOrderProject;

public class FutureCancelOrderResponseEntity
{
    [JsonPropertyName("symbol")]
    public string Symbol { get; set; }

    [JsonPropertyName("clOrderID")]
    public string ClOrderID { get; set; }

    [JsonPropertyName("fillSize")]
    public double FillSize { get; set; }

    [JsonPropertyName("orderID")]
    public string OrderID { get; set; }

    [JsonPropertyName("orderType")]
    public int OrderType { get; set; }

    [JsonPropertyName("postOnly")]
    public bool PostOnly { get; set; }

    [JsonPropertyName("price")]
    public double Price { get; set; }

    [JsonPropertyName("side")]
    public string Side { get; set; }

    [JsonPropertyName("size")]
    public long Size { get; set; }

    [JsonPropertyName("status")]
    public long Status { get; set; }

    [JsonPropertyName("time_in_force")]
    public string TimeInForce { get; set; }

    [JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }

    [JsonPropertyName("trigger")]
    public bool Trigger { get; set; }

    [JsonPropertyName("triggerPrice")]
    public double TriggerPrice { get; set; }

    [JsonPropertyName("avgFillPrice")]
    public double AvgFillPrice { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; }

    [JsonPropertyName("stealth")]
    public double Stealth { get; set; }

    [JsonPropertyName("deviation")]
    public double Deviation { get; set; }

    [JsonPropertyName("remainingSize")]
    public double RemainingSize { get; set; }

    [JsonPropertyName("originalSize")]
    public double OriginalSize { get; set; }
}