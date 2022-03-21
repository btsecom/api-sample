const webSocket = require('ws');
const { getWsOssSpotUrl } = require('../utils/common');

const client = new webSocket(getWsOssSpotUrl());
const market = 'BTC-USD';
const grouping = 1;
let lastTimestamp = 0;

client.onerror = () => {
  console.log('connection error');
};

client.onopen = () => {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      const payload = {
        op: 'subscribe',
        args: [`snapshot:${market}_${grouping}`],
      };
      console.log('subscribing snapshot orderbook to get the full orderbook for each update: ' + JSON.stringify(payload));
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
    const raw = JSON.parse(e.data);
    const topic = raw && raw.topic ? raw.topic : '';
    const data = raw.data;

    if (topic.startsWith('snapshot')) {
      // NOTE: snapshot contains complete orderbook and can be used as the replacement for previous orderbook websocket topic
      // the `bids` and `asks` under data object contain correspoding orders.
      console.log(data);
    } else {
      console.log(`ERROR: unsupported topic: ${topic}`);
      return;
    }

    lastTimestamp = now;
  }
};

process.on('SIGINT', () => {
  client.close();
  process.exit();
});
