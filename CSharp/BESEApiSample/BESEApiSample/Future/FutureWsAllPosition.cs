using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using BESEApiSample.Common;
using BESEApiSample.Common.Entities;

namespace BESEApiSample.Future;

public class FutureWsAllPosition
{
    private readonly ClientWebSocket _client = new();
    private readonly Uri _wsFuturesUrl = new(Utils.GetFuturesWsUrl());


    public async Task ConnectAndListenAsync()
    {
        await ConnectAsync();
        await ListenAsync();
    }

    private async Task ConnectAsync()
    {
        await _client.ConnectAsync(_wsFuturesUrl, CancellationToken.None);

        if (_client.State == WebSocketState.Open)
        {
            await SubscribeAsync();
        }
    }

    private async Task SubscribeAsync()
    {
        var headers = Utils.GetHeaders("/ws/futures");

        var authPayload = new
        {
            op = "authKeyExpires",
            args = new[]
            {
                headers["request-api"],
                headers["request-nonce"],
                headers["request-sign"]
            }
        };

        Console.WriteLine($"sending auth msg: {JsonSerializer.Serialize(authPayload)}");
        await SendAsync(authPayload);

        var payload = new WsSubscriptionRequestEntity("subscribe", new[] { "allPosition" });

        Console.WriteLine($"sending msg: {JsonSerializer.Serialize(payload)}");
        await SendAsync(payload);
    }

    private async Task SendAsync(object payload)
    {
        var jsonString = JsonSerializer.Serialize(payload);
        var buffer = Encoding.UTF8.GetBytes(jsonString);
        await _client.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
    }

    private async Task ListenAsync()
    {
        var buffer = new byte[1024 * 4];
        while (_client.State == WebSocketState.Open)
        {
            var result = await _client.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            if (result.MessageType == WebSocketMessageType.Text)
            {
                var received = Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine(received);
            }
        }

        Console.WriteLine("echo-protocol client closed");
    }
}