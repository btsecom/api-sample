// See https://aka.ms/new-console-template for more information

using SpotQueryMarketPriceProject;

var marketPriceFetcher = new SpotQueryMarketPrice();
var marketPrice = await marketPriceFetcher.GetMarketPriceAsync(new SpotQueryMarketRequestEntity
{
    Symbol = "", // Change to your symbol
});

Console.WriteLine(marketPrice);
