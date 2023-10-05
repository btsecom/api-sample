// See https://aka.ms/new-console-template for more information

using SpotWsAuthenticationProject;

var spotWsAuthentication = new SpotWsAuthentication();
await spotWsAuthentication.StartListeningAsync();