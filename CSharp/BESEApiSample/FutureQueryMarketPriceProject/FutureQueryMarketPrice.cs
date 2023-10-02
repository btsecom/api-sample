using BESEApiSample.Common;
using Flurl;

namespace FutureQueryMarketPriceProject;

public class FutureQueryMarketPrice
{
    private readonly HttpClient _httpClient = new();

    public async Task<object> GetMarketPriceAsync(MarketPriceRequest request)
    {
        const string endpoint = $"/api/{ApiConstants.FuturesApiVersion}/price";
        var url = Utils.GetFuturesFullUrl(endpoint)
            .SetQueryParams(new
            {
                symbol = request.Symbol,
                useNewSymbolNaming = request.UseNewSymbolNaming
            });

        try
        {
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }

            return $"Error: {response.StatusCode}";
        }
        catch (Exception ex)
        {
            return ex;
        }
    }
}