using System.Text.Json.Serialization;

namespace BESEApiSample.Spot.ResponseEntities;

public class SpotCancelOrderResponseEntity
{
    [JsonPropertyName("status")]
    public int Status { get; set; }

    [JsonPropertyName("symbol")]
    public string Symbol { get; set; }

    [JsonPropertyName("orderType")]
    public int OrderType { get; set; }

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("side")]
    public string Side { get; set; }

    [JsonPropertyName("size")]
    public decimal Size { get; set; }

    [JsonPropertyName("orderID")]
    public string OrderID { get; set; }

    [JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }

    [JsonPropertyName("triggerPrice")]
    public decimal TriggerPrice { get; set; }

    [JsonPropertyName("stopPrice")]
    public decimal? StopPrice { get; set; }

    [JsonPropertyName("trigger")]
    public bool Trigger { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; }

    [JsonPropertyName("averageFillPrice")]
    public decimal AverageFillPrice { get; set; }

    [JsonPropertyName("fillSize")]
    public decimal FillSize { get; set; }

    [JsonPropertyName("clOrderID")]
    public string ClOrderID { get; set; }

    [JsonPropertyName("stealth")]
    public double Stealth { get; set; }

    [JsonPropertyName("deviation")]
    public double Deviation { get; set; }

    [JsonPropertyName("postOnly")]
    public bool PostOnly { get; set; }

    [JsonPropertyName("originalSize")]
    public decimal OriginalSize { get; set; }

    [JsonPropertyName("remainingSize")]
    public decimal RemainingSize { get; set; }

    [JsonPropertyName("time_in_force")]
    public string TimeInForce { get; set; }
}