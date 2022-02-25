const webSocket = require('ws');
const { getWsOssSpotUrl } = require('../utils/common');

const client = new webSocket(getWsOssSpotUrl());
const snapOrders = {};
const deltaOrders = {};
const market = 'BTC-USD';
const grouping = 2;
const recordsToShow = 15; // number of asks/bids to show
const displaySnapshot = false; // enable this to display snapshot orderbook
const displayDelta = true; // enable this to display delta orderbook
let lastTimestamp = 0;
let deltaSeqNum = 0;

client.onerror = () => {
  console.log('connection error');
};

client.onopen = () => {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      const payload = {
        op: 'subscribe',
        args: [`snapshot:${market}_${grouping}`, `update:${market}_${grouping}`],
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
  const reduceFunc = (map, obj) => {
    if (map && obj && obj.length === 2) {
      const val = obj[1];
      if (val === '0') {
        delete map[obj[0]];
      } else {
        map[obj[0]] = val;
      }
    }
    return map;
  };

  const printOrderbook = (data, typeDesc, n) => {
    const askKeys = Object.keys(data.asks).sort().slice(0, n).reverse();
    const bidKeys = Object.keys(data.bids).sort().reverse().slice(0, n);

    // validate cross orderbook
    const bestAsk = askKeys[askKeys.length - 1];
    const bestBid = bidKeys[0];
    console.log();
    console.log(`best ask/bid: ${bestAsk} / ${bestBid}`);
    console.log();
    if (bestBid >= bestAsk) {
      console.log('ERROR: cross orderbook!');
      client.close();
    }

    console.log(`${typeDesc}s: asks/bids`);
    for (const k of askKeys) {
      console.log(`\t${k}: ${data.asks[k]}`);
    }
    console.log();
    for (const k of bidKeys) {
      console.log(`\t${k}: ${data.bids[k]}`);
    }
    console.log();
  };

  if (typeof e.data === 'string') {
    const now = Date.now();
    if (!lastTimestamp) {
      lastTimestamp = now;
    }
    //console.log("received: '" + e.data + "'");
    const raw = JSON.parse(e.data);
    const topic = raw && raw.topic ? raw.topic : '';
    const data = raw.data;

    if (topic.startsWith('snapshot')) {
      snapOrders.asks = raw.data.asks.reduce(reduceFunc, {});
      snapOrders.bids = raw.data.bids.reduce(reduceFunc, {});
    } else if (topic.startsWith('update')) {
      // SeqNum/PrevSeqNum are used to make sure the delta data stream is continuous to construct the full snapshot.
      // If it's not then we need to reconnect to reset the delta stream.
      if (deltaSeqNum && deltaSeqNum !== data.prevSeqNum) {
        console.log(
          `ERROR: seq number not matched! (local: ${deltaSeqNum}, prev: ${data.prevSeqNum}, current: ${data.seqNum})`
        );
        client.close();
      }

      deltaSeqNum = data.seqNum;
      const asks = deltaOrders.asks || {};
      const bids = deltaOrders.bids || {};
      deltaOrders.asks = raw.data.asks.reduce(reduceFunc, asks);
      deltaOrders.bids = raw.data.bids.reduce(reduceFunc, bids);
    } else {
      console.log(`ERROR: unsupported topic: ${topic}`);
      return;
    }

    // print snapshot
    if (displaySnapshot) {
      if (snapOrders && snapOrders.asks && snapOrders.bids) {
        printOrderbook(snapOrders, 'snapshot', recordsToShow);
      } else {
        console.log('snapshot data not ready.');
      }
    }

    // print delta
    if (displayDelta) {
      if (deltaOrders && deltaOrders.asks && deltaOrders.bids) {
        printOrderbook(deltaOrders, 'delta', recordsToShow);
      } else {
        console.log('delta data not ready.');
      }
    }

    lastTimestamp = now;
  }
};

process.on('SIGINT', () => {
  client.close();
  process.exit();
});
