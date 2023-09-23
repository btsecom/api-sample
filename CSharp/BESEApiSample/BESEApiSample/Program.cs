using BESEApiSample.Future;

// Make Spot Order

// Cancel Spot Order
/* 
var spotCancelOrder = new SpotCancelOrder();

var cancelOrderResponse = await spotCancelOrder.CancelOrderAsync(new SpotCancelOrderRequestEntity
{
    Symbol = "BTC-USD",
    OrderID = "92f3bc64-e4b6-478a-add3-7463f4871f69",
});

Console.WriteLine(JsonSerializer.Serialize(cancelOrderResponse));
*/

// Websocket Authentication
/* 
var futuresWsAuthentication = new FuturesWsAuthentication();

await futuresWsAuthentication.StartListeningAsync();
*/

// Websocket Public Trades
var futuresWsPublicTrades = new FuturesWsPublicTrades();
await futuresWsPublicTrades.ConnectAndListenAsync();
