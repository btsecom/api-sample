using System.Net.Http.Json;
using BTSEApiSample.Common;
using Flurl;

namespace FutureCancelOrderProject;

public class FutureCancelOrder
{
    private readonly HttpClient _httpClient = new();

    public async Task<List<FutureCancelOrderResponseEntity>?> CancelOrderAsync(FutureCancelOrderRequestEntity requestEntity)
    {
        var request = GetHttpRequestMessage(requestEntity);

        try
        {
            var response = await _httpClient.SendAsync(request);

            // If the response is not successful, print the error message
            if (response.IsSuccessStatusCode is false)
            {
                Console.WriteLine($"Error message: {await response.Content.ReadAsStringAsync()}");
            }

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<List<FutureCancelOrderResponseEntity>>();
        }
        catch (HttpRequestException httpErr)
        {
            Console.WriteLine($"HTTP error occurred: {httpErr.Message}");
            throw;
        }
        catch (Exception err)
        {
            Console.WriteLine($"Other error occurred: {err.Message}");
            throw;
        }
    }

    private static HttpRequestMessage GetHttpRequestMessage(FutureCancelOrderRequestEntity requestEntity)
    {
        const string endPoint = $"/api/{ApiConstants.FuturesApiVersion}/order";
        var requestUri = Utils.GetFuturesFullUrl(endPoint)
            .SetQueryParams(new
            {
                symbol = requestEntity.Symbol,
                orderID = requestEntity.OrderID,
                clOrderID = requestEntity.ClOrderID
            }, NullValueHandling.Ignore);
        var request = new HttpRequestMessage(HttpMethod.Delete, requestUri);

        // Set headers
        var headers = Utils.GetHeaders(endPoint);
        foreach (var (key, value) in headers)
        {
            request.Headers.Add(key, (string?)value);
        }

        return request;
    }
}