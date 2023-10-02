using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SpotCancelOrderProject;

public class SpotCancelOrderRequestEntity
{
    [JsonPropertyName("symbol")]
    [Required]
    public string Symbol { get; set; }

    [JsonPropertyName("orderID")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string? OrderID { get; set; }

    [JsonPropertyName("clOrderID")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string? ClOrderID { get; set; }
}