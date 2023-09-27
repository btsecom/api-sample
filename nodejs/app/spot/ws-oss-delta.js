const webSocket = require('ws');
const { getWsOssSpotUrl } = require('../utils/common');

const reconnectInterval = 3000;
let client;
let deltaOrders = {};
const market = 'BTC-USD';
const grouping = 0;
const recordsToShow = 15; // number of asks/bids to show
let lastTimestamp = 0;
let deltaSeqNum = 0;

const connect = () => {
  client = new webSocket(getWsOssSpotUrl());

  function subscribe() {
    if (client.readyState === client.OPEN) {
      const payload = {
        op: 'subscribe',
        args: [`update:${market}_${grouping}`],
      };
      console.log('subscribing to oss delta for incremental update: ' + JSON.stringify(payload));
      client.send(JSON.stringify(payload));
    }
  }

  function unsubscribe() {
    if (client.readyState === client.OPEN) {
      const payload = {
        op: 'unsubscribe',
        args: [`update:${market}_${grouping}`],
      };
      console.log('un-subscribing to oss delta for incremental update: ' + JSON.stringify(payload));
      client.send(JSON.stringify(payload));
    }
  }

  function reset() {
    deltaOrders = {};
    lastTimestamp = 0;
    deltaSeqNum = 0;
  }

  function reconnect() {
    reset();
    setTimeout(connect, reconnectInterval);
  }

  function resubscribe() {
    reset();
    unsubscribe();
    subscribe();
  }

  client.onerror = () => {
    console.log('connection error');
  };

  client.onopen = () => {
    subscribe();
  };

  client.onclose = () => {
    console.log('echo-protocol client closed');
    reconnect();
  };

  client.onmessage = (e) => {
    // ***********************************************
    // [NOTE]
    //   1. Once connected to "update" topic, the first message passed back is a complete
    //      snapshot of the orderbook to append future delta updates to.
    //   2. Orders will be stores in `bids` and `asks` and each order is a (PRICE, SIZE) tuple.
    //   3. If the SIZE is zero then that price entry should be removed from the orderbook
    //   4. If the SIZE is not zero then should be added or replace existing entry of the same
    //      PRICE with the new SIZE
    //   5. Client should reconnect or (unsubscribe-then-re-subscribe) upon the following
    //      conditions:
    //        - Disconnect from server
    //        - Sequence number out of order
    //        - Cross orderbook (best-bid >= best-ask)
    // ***********************************************

    const prepareOrderbookFunc = (map, obj) => {
      if (map && obj && obj.length === 2) {
        const val = obj[1];
        if (val === '0') {
          // delete entry if SIZE is 0
          delete map[obj[0]];
        } else {
          // add or replace the entry on non-zero sizes
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
        console.log('ERROR: cross orderbook! Should re-subscribe!');
        resubscribe();
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

      if (topic.startsWith('update')) {
        // SeqNum/PrevSeqNum are used to make sure the delta data stream is continuous to construct the full snapshot.
        // If it's not then we need to reconnect to reset the delta stream.
        if (deltaSeqNum && deltaSeqNum !== data.prevSeqNum) {
          console.log(
            `ERROR: seq number not matched! (local: ${deltaSeqNum}, prev: ${data.prevSeqNum}, current: ${data.seqNum})`
          );
          resubscribe();
        }

        deltaSeqNum = data.seqNum;
        const asks = deltaOrders.asks || {};
        const bids = deltaOrders.bids || {};
        deltaOrders.asks = raw.data.asks.reduce(prepareOrderbookFunc, asks);
        deltaOrders.bids = raw.data.bids.reduce(prepareOrderbookFunc, bids);

        if (deltaOrders && deltaOrders.asks && deltaOrders.bids) {
          printOrderbook(deltaOrders, 'delta', recordsToShow);
        }
      } else {
        //console.log(`ERROR: unsupported topic: ${topic}`);
        return;
      }
    }
  };
};

connect();

process.on('SIGINT', () => {
  if (client) {
    client.close();
  }
  process.exit();
});
