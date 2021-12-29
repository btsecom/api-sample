const webSocket = require('ws');
const { getWsSpotUrl } = require('../../utils/common');

const client = new webSocket(getWsSpotUrl());
const market = 'BTC-USD';
let lastTimestamp = 0;

client.onerror = () => {
  console.log('connection error');
};

client.onopen = () => {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      const payload = {
        op: 'subscribe',
        args: [`orderBookApi:${market}_0`],
      };
      console.log('sending msg: ' + JSON.stringify(payload));
      client.send(JSON.stringify(payload));
    }
  }
  subscribe();
};

client.onclose = () => {
  console.log('echo-protocol client closed');
};

client.onmessage = (e) => {
  if (typeof e.data === 'string') {
    const now = Date.now();
    if (!lastTimestamp) {
      lastTimestamp = now;
    }
    console.log("Received: '" + e.data + "'");
    console.log(`market: ${market}, time diff: ${now - lastTimestamp} ms`);
    lastTimestamp = now;
  }
};

process.on('SIGINT', () => {
  client.close();
  process.exit();
});
