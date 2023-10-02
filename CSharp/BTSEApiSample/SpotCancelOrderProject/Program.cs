using System.Text.Json;
using SpotCancelOrderProject;

var spotCancelOrder = new SpotCancelOrder();

var cancelOrderResponse = await spotCancelOrder.CancelOrderAsync(new SpotCancelOrderRequestEntity
{
    Symbol = "BTC-USD", // Replace with your symbol
    OrderID = "orderID", // Replace with your order ID
});

Console.WriteLine(JsonSerializer.Serialize(cancelOrderResponse));