// See https://aka.ms/new-console-template for more information

using FutureQueryMarketPriceProject;

var marketPriceFetcher = new FutureQueryMarketPrice();

var marketPrice = await marketPriceFetcher.GetMarketPriceAsync(new FutureQueryMarketRequestEntity
{
    Symbol = "BTCPFC", // Change to your symbol
    UseNewSymbolNaming = false, // Change to true if you are using new symbol naming
});

Console.WriteLine(marketPrice);