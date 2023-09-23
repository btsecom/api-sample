using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using BESEApiSample.Common;

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
        var headers = Utils.GetHeaders(endPoint, requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, Utils.GetSpotFullUrl(endPoint));

        foreach (var header in headers)
        {
            request.Headers.Add((string)header.Key, (string?)header.Value);
        }

        request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");

        return request;
    }
}