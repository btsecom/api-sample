using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FutureQueryMarketPriceProject;

public class FutureQueryMarketRequestEntity
{
    [JsonPropertyName("symbol")]
    [Required]
    public string Symbol { get; set; }

    [JsonPropertyName("useNewSymbolNaming")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? UseNewSymbolNaming { get; set; }
}