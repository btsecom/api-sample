const webSocket = require('ws');
const { getWsSpotUrl } = require('../utils/common');
const spotClient = new webSocket(getWsSpotUrl());

const snapOrders = {};
const market = 'ETH-USD';

// spot
spotClient.onerror = () => {
  console.log('spot connection error');
};

spotClient.onopen = () => {
  function subscribe() {
    if (spotClient.readyState === spotClient.OPEN) {
      const payload = {
        op: 'subscribe',
        args: [`orderBookApi:${market}_0`],
      };
      console.log('sending spot msg: ' + JSON.stringify(payload));
      spotClient.send(JSON.stringify(payload));
    }
  }
  subscribe();
};

spotClient.onclose = () => {
  console.log('echo-protocol spotClient closed');
};

spotClient.onmessage = (e) => {
  if (typeof e.data === 'string') {
    //console.log("received: '" + e.data + "'");
    const raw = JSON.parse(e.data);
    const topic = raw && raw.topic ? raw.topic : '';

    if (topic.startsWith('orderBookApi')) {
      const asks = Object.assign({}, ...raw.data.sellQuote.map((x) => ({ [x.price]: x.size })));
      const bids = Object.assign({}, ...raw.data.buyQuote.map((x) => ({ [x.price]: x.size })));
      snapOrders.asks = asks;
      snapOrders.bids = bids;

      console.log('>> TOPIC: ', topic);
      console.log('>> ASKS: ', JSON.stringify(asks));
      console.log('>> BIDS: ', JSON.stringify(bids));
    }
  }
};

// global
process.on('SIGINT', () => {
  spotClient.close();
  process.exit();
});
