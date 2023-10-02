// See https://aka.ms/new-console-template for more information

using System.Text.Json;
using FutureMakeOrderProject;

var futuresOrderService = new FuturesMakeOrder();
var futurePlaceOrderResponseEntities = await futuresOrderService.PlaceOrderAsync(new FutureMakeOrderRequestEntity()
{
    Symbol = "BTCPFC",
    Price = 21000,
    Size = 1,
    Side = "BUY",
    Type = "LIMIT",
});

Console.WriteLine($"Response: {JsonSerializer.Serialize(futurePlaceOrderResponseEntities)}");