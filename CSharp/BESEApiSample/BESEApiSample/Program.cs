using BESEApiSample.Future;

// Make Spot Order


// Websocket Authentication
/* 
var futuresWsAuthentication = new FuturesWsAuthentication();

await futuresWsAuthentication.StartListeningAsync();
*/

// Websocket Public Trades
var futuresWsPublicTrades = new FuturesWsPublicTrades();
await futuresWsPublicTrades.ConnectAndListenAsync();
