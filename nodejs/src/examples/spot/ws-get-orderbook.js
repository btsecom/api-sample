const webSocket = require('ws');
const { getWsSpotUrl } = require('../../utils/common');

const client = new webSocket(getWsSpotUrl());

client.onerror = function () {
  console.log('Connection Error');
};

client.onopen = function () {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      const payload = {
        op: 'subscribe',
        args: ['orderBookApi:BTC-USD_0'],
      };
      console.log('sending msg: ' + JSON.stringify(payload));
      client.send(JSON.stringify(payload));
    }
  }
  subscribe();
};

client.onclose = function () {
  console.log('echo-protocol Client Closed');
};

client.onmessage = function (e) {
  if (typeof e.data === 'string') {
    console.log("Received: '" + e.data + "'");
  }
};

process.on('SIGINT', function () {
  client.close();
  process.exit();
});
