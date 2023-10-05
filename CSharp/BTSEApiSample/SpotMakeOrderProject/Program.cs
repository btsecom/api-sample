using System.Text.Json;
using SpotMakeOrderProject;

var makeSpotOrder = new SpotMakeOrder();

var spotOrderResponse = await makeSpotOrder.PlaceOrder(new SpotMakeOrderRequestEntity
{
    Size = 0.0005M,
    Side = "BUY",
    Symbol = "BTC-USD",
    TxType = "LIMIT",
    Type = "MARKET",
});
        
Console.WriteLine(JsonSerializer.Serialize(spotOrderResponse));
