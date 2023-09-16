using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using BESEApiSample.Common;
using BESEApiSample.Future.RequestEntities;

namespace WsAuthentication;

public class FuturesWsAuthentication
{
    private readonly ClientWebSocket _webSocket = new();

    private void OnMessage(string message)
    {
        Console.WriteLine(message);
    }

    private void OnError(Exception ex)
    {
        Console.WriteLine(ex.Message);
    }

    private void OnClose()
    {
        Console.WriteLine("### socket closed ###");
    }

    private async Task OnOpenAsync()
    {
        const string url = "/ws/futures";
        var headers = Utils.GetHeaders(url);

        var payload = new WsSubscriptionRequestEntity("authKeyExpires", new[]
        {
            headers["request-api"],
            headers["request-nonce"],
            headers["request-sign"]
        });

        var jsonString = JsonSerializer.Serialize(payload);
        var bytes = Encoding.UTF8.GetBytes(jsonString);
        await _webSocket.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, CancellationToken.None);
    }

    public async Task StartListeningAsync()
    {
        var wsUri = new Uri(Utils.GetFuturesWsUrl());

        try
        {
            await _webSocket.ConnectAsync(wsUri, CancellationToken.None);

            await OnOpenAsync();

            var buffer = new byte[1024 * 4];
            while (_webSocket.State == WebSocketState.Open)
            {
                var result = await _webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Close)
                {
                    await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                    OnClose();
                }
                else
                {
                    var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    OnMessage(message);
                }
            }
        }
        catch (WebSocketException wsEx)
        {
            OnError(wsEx);
        }
        catch (Exception e)
        {
            OnError(e);
        }
    }
}