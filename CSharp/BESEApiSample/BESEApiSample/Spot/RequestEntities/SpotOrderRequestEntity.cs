using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BESEApiSample.Spot.RequestEntities;

public class SpotOrderRequestEntity
{
    [JsonPropertyName("symbol")]
    [Required]
    public string Symbol { get; set; }

    [JsonPropertyName("price")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public decimal? Price { get; set; }

    [JsonPropertyName("size")]
    [Required]
    public decimal Size { get; set; }

    [JsonPropertyName("side")]
    [Required]
    public string Side { get; set; }

    [JsonPropertyName("time_in_force")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string TimeInForce { get; set; }

    [JsonPropertyName("type")]
    [Required]
    public string Type { get; set; }

    [JsonPropertyName("txType")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string TxType { get; set; }

    [JsonPropertyName("stopPrice")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public decimal? StopPrice { get; set; }

    [JsonPropertyName("triggerPrice")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public decimal? TriggerPrice { get; set; }

    [JsonPropertyName("trailValue")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public decimal? TrailValue { get; set; }

    [JsonPropertyName("postOnly")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool? PostOnly { get; set; }

    [JsonPropertyName("clOrderID")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string ClOrderID { get; set; }

    [JsonPropertyName("stealth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public decimal? Stealth { get; set; }

    [JsonPropertyName("deviation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public decimal? Deviation { get; set; }
}