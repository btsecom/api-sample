using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SpotQueryMarketPriceProject;

public class SpotQueryMarketRequestEntity
{
    [JsonPropertyName("symbol")]
    [Required]
    public string Symbol { get; set; }
}