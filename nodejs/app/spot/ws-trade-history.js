const webSocket = require('ws');
const { getAuthHeaders, getWsSpotUrl } = require('../utils/common');

const client = new webSocket(getWsSpotUrl());

client.onerror = () => {
  console.log('connection error');
};

client.onopen = () => {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      // subscribe to trade history api websocket
      const payload = {
        op: 'subscribe',
        args: ['tradeHistory:BTC-USD'],
      };
      console.log('sending msg: ' + JSON.stringify(payload));
      client.send(JSON.stringify(payload));

      console.log('\n\nwaiting for trade history...\n\n');
    }
  }
  subscribe();
};

client.onclose = () => {
  console.log('echo-protocol client closed');
};

client.onmessage = (e) => {
  if (typeof e.data === 'string') {
    console.log("Received: '" + e.data + "'");
  }
};

process.on('SIGINT', () => {
  client.close();
  process.exit();
});
