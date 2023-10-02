using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using BTSEApiSample.Common;

namespace SpotMakeOrderProject;

public class SpotMakeOrder
{
    private readonly HttpClient _httpClient = new();

    public async Task<List<SpotMakeOrderResponseEntity>?> PlaceOrder(SpotMakeOrderRequestEntity requestEntity)
    {
        var requestMessage = GetHttpRequestMessage(requestEntity);

        try
        {
            var response = await _httpClient.SendAsync(requestMessage);

            // If the response is not successful, print the error message
            if (response.IsSuccessStatusCode is false)
            {
                Console.WriteLine($"Error message: {await response.Content.ReadAsStringAsync()}");
            }

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<List<SpotMakeOrderResponseEntity>>();
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

    private static HttpRequestMessage GetHttpRequestMessage(SpotMakeOrderRequestEntity requestEntity)
    {
        const string endPoint = $"/api/{ApiConstants.SpotApiVersion}/order/peg";
        var requestBody = JsonSerializer.Serialize(requestEntity);
        var request = new HttpRequestMessage(HttpMethod.Post, Utils.GetSpotFullUrl(endPoint))
        {
            Content = new StringContent(requestBody, Encoding.UTF8, "application/json"),
        };

        var headers = Utils.GetHeaders(endPoint, requestBody);
        foreach (var header in headers)
        {
            request.Headers.Add(header.Key, (string?)header.Value);
        }

        return request;
    }
}