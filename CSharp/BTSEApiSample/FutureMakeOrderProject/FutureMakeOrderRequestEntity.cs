using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FutureMakeOrderProject;

public class FutureMakeOrderRequestEntity
{
    [JsonPropertyName("symbol")]
    [Required]
    public string Symbol { get; set; }

    [JsonPropertyName("price")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public double? Price { get; set; }

    [JsonPropertyName("size")]
    [Required]
    public long Size { get; set; }

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
    public double? StopPrice { get; set; }

    [JsonPropertyName("triggerPrice")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public double? TriggerPrice { get; set; }

    [JsonPropertyName("trailValue")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public double? TrailValue { get; set; }

    [JsonPropertyName("postOnly")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool? PostOnly { get; set; }

    [JsonPropertyName("reduceOnly")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool? ReduceOnly { get; set; }

    [JsonPropertyName("clOrderID")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string ClOrderID { get; set; }

    [JsonPropertyName("trigger")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string Trigger { get; set; }
}