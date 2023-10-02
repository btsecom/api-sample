using System.Text.Json.Serialization;

namespace FutureQueryMarketPriceProject;

public class MarketPriceRequest
{
    [JsonPropertyName("symbol")]
    public string Symbol { get; set; }

    [JsonPropertyName("useNewSymbolNaming")]
    public bool UseNewSymbolNaming { get; set; } = false;
}