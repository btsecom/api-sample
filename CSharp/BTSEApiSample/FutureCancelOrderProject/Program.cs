using System.Text.Json;
using FutureCancelOrderProject;

var futureCancelOrder = new FutureCancelOrder();
var response = await futureCancelOrder.CancelOrderAsync(new FutureCancelOrderRequestEntity
{
    Symbol = "Symbol", // Replace with your symbol
    OrderID = "order ID", // Replace with your order ID
    // ClOrderID = null // Replace with your custom order ID
});

Console.WriteLine(JsonSerializer.Serialize(response));