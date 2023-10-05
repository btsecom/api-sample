using System.Text.Json.Serialization;

namespace BTSEApiSample.Common.Entities;

public class WsSubscriptionRequestEntity
{
    public WsSubscriptionRequestEntity(string operation, string[] arguments)
    {
        Operation = operation;
        Arguments = arguments;
    }

    [JsonPropertyName("op")]
    public string Operation { get; set; }

    [JsonPropertyName("args")]
    public string[] Arguments { get; set; }
}