using System.Text.Json.Serialization;

namespace FutureQueryMarketPriceProject;

public class FutureQueryMarketRequestEntity
{
    [JsonPropertyName("symbol")]
    public string Symbol { get; set; }

    [JsonPropertyName("useNewSymbolNaming")]
    public bool UseNewSymbolNaming { get; set; } = false;
}