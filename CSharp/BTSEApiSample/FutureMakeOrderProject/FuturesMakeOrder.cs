using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using BTSEApiSample;
using BTSEApiSample.Common;

namespace FutureMakeOrderProject;

public class FuturesMakeOrder
{
    private readonly HttpClient _httpClient = new();

    public async Task<List<FutureMakeOrderResponseEntity>?> PlaceOrderAsync(FutureMakeOrderRequestEntity requestEntity)
    {
        var requestMessage = GetRequestMessage(requestEntity);
        try
        {
            var response = await _httpClient.SendAsync(requestMessage);

            // If the response is not successful, print the error message
            if (response.IsSuccessStatusCode is false)
            {
                Console.WriteLine($"Error message: {await response.Content.ReadAsStringAsync()}");
            }

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<List<FutureMakeOrderResponseEntity>>();
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

    private static HttpRequestMessage GetRequestMessage(FutureMakeOrderRequestEntity requestEntity)
    {
        const string endPoint = $"/api/{ApiConstants.FuturesApiVersion}/order";
        var requestBody = JsonSerializer.Serialize(requestEntity);
        var request = new HttpRequestMessage(HttpMethod.Post, Utils.GetFuturesFullUrl(endPoint))
        {
            Content = new StringContent(requestBody, Encoding.UTF8, "application/json"),
        };

        // Set headers
        var headers = Utils.GetHeaders(endPoint, requestBody);
        foreach (var header in headers)
        {
            request.Headers.Add(header.Key, header.Value);
        }

        return request;
    }
}