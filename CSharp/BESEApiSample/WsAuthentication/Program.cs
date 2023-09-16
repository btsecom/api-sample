// See https://aka.ms/new-console-template for more information

using WsAuthentication;

var futuresWsAuthentication = new FuturesWsAuthentication();
await futuresWsAuthentication.StartListeningAsync();
