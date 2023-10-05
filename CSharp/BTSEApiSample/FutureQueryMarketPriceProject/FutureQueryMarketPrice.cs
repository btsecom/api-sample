using BTSEApiSample.Common;
using Flurl;

namespace FutureQueryMarketPriceProject;

public class FutureQueryMarketPrice
{
    private readonly HttpClient _httpClient = new();

    public async Task<object> GetMarketPriceAsync(FutureQueryMarketRequestEntity requestEntity)
    {
        const string endpoint = $"/api/{ApiConstants.FuturesApiVersion}/price";
        var url = Utils.GetFuturesFullUrl(endpoint)
            .SetQueryParams(new
            {
                symbol = requestEntity.Symbol,
                useNewSymbolNaming = requestEntity.UseNewSymbolNaming
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