const webSocket = require('ws');
const { getWsSpotUrl, getWsOssSpotUrl } = require('../utils/common');

const ossClient = new webSocket(getWsOssSpotUrl());
const spotClient = new webSocket(getWsSpotUrl());

const snapOrders = {};
const deltaOrders = {};
const market = 'BTC-USD';
const recordsToShow = 15; // number of asks/bids to show
const debug = false; // enable this to show orderbook in details

let deltaSeqNum = 0;
let iteration = 0;
let totalErrors = 0;
let totalCounts = 0;

const compareOrderbook = () => {
  const validateCrosssOrderbook = (data, typeDesc, n) => {
    const askKeys = Object.keys(data.asks).sort().slice(0, n).reverse();
    const bidKeys = Object.keys(data.bids).sort().reverse().slice(0, n);

    const bestAsk = askKeys[askKeys.length - 1];
    const bestBid = bidKeys[0];
    if (bestBid >= bestAsk) {
      console.log(`ERROR: cross orderbook ${typeDesc}!`);
      console.log(data);
      console.log();
      ossClient.close();
      spotClient.close();
    }
  };

  const checkOrderbooks = (snapshot, delta, n, isAsk = true) => {
    const concat = Object.assign({}, snapshot, delta);
    const keysRaw = [...new Set(Object.keys(concat))].sort();
    const keys = isAsk ? keysRaw.slice(0, n).reverse() : keysRaw.reverse().slice(0, n);

    let error = 0;
    const total = keys.length;
    const reset = '\x1b[0m';
    const diff = '\x1b[35m';
    const title = isAsk ? 'asks:' : 'bids';
    if (debug) {
      console.log(title);
    }
    for (const k of keys) {
      const s = snapshot[k];
      const d = delta[k];
      error = s === d ? error : error + 1;
      const color = s === d ? reset : diff;
      if (debug) {
        console.log(color, `\t ${k}: ${s} / ${d}`);
      }
    }
    if (debug) {
      console.log(reset);
      console.log(`Correct %: ${(100.0 * (total - error)) / total} %`);
      console.log();
    }
    return {
      error,
      total,
    };
  };

  const spotReady = snapOrders && snapOrders.asks && snapOrders.bids;
  const deltaReady = deltaOrders && deltaOrders.asks && deltaOrders.bids;

  if (!spotReady || !deltaReady) {
    return;
  }

  iteration += 1;

  // cross orderbook
  validateCrosssOrderbook(snapOrders, 'old-snapshot', recordsToShow);
  validateCrosssOrderbook(deltaOrders, 'delta', recordsToShow);

  const { error: askError, total: askTotal } = checkOrderbooks(snapOrders.asks, deltaOrders.asks, recordsToShow, true);
  const { error: bidError, total: bidTotal } = checkOrderbooks(snapOrders.bids, deltaOrders.bids, recordsToShow, false);

  totalErrors = totalErrors + askError + bidError;
  totalCounts = totalCounts + askTotal + bidTotal;

  if (iteration % 100 === 0) {
    console.log('#######################################################################');
    console.log(`# Total Correct %: ${((100.0 * (totalCounts - totalErrors)) / totalCounts).toFixed(2)} %`);
    console.log('#######################################################################');
    console.log();
    totalCounts = 0;
    totalErrors = 0;
  }
};

// oss
ossClient.onerror = () => {
  console.log('oss connection error');
};

ossClient.onopen = () => {
  function subscribe() {
    if (ossClient.readyState === ossClient.OPEN) {
      const payload = {
        op: 'subscribe',
        args: [`update:${market}`],
      };
      console.log('sending oss msg: ' + JSON.stringify(payload));
      ossClient.send(JSON.stringify(payload));
    }
  }
  subscribe();
};

ossClient.onclose = () => {
  console.log('echo-protocol ossClient closed');
};

ossClient.onmessage = (e) => {
  const reduceOssFunc = (map, obj) => {
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

  if (typeof e.data === 'string') {
    //console.log("received: '" + e.data + "'");
    const raw = JSON.parse(e.data);
    const topic = raw && raw.topic ? raw.topic : '';
    const data = raw.data;

    if (topic.startsWith('update')) {
      // SeqNum/PrevSeqNum are used to make sure the delta data stream is continuous to construct the full snapshot.
      // If it's not then we need to reconnect to reset the delta stream.
      if (deltaSeqNum && deltaSeqNum !== data.prevSeqNum) {
        console.log(
          `ERROR: seq number not matched! (local: ${deltaSeqNum}, prev: ${data.prevSeqNum}, current: ${data.seqNum})`
        );
        ossClient.close();
      }

      deltaSeqNum = data.seqNum;
      const asks = deltaOrders.asks || {};
      const bids = deltaOrders.bids || {};
      deltaOrders.asks = raw.data.asks.reduce(reduceOssFunc, asks);
      deltaOrders.bids = raw.data.bids.reduce(reduceOssFunc, bids);
    } else {
      console.log(`ERROR: unsupported topic: ${topic}`);
      return;
    }

    compareOrderbook();
  }
};

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

      compareOrderbook();
    }
  }
};

// global
process.on('SIGINT', () => {
  ossClient.close();
  spotClient.close();
  process.exit();
});
