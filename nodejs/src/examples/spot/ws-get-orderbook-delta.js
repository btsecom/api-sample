const webSocket = require('ws');
const { getWsOssSpotUrl } = require('../../utils/common');

const client = new webSocket(getWsOssSpotUrl());
const snapOrders = {};
const deltaOrders = {};
const market = 'BTC-USD';
var lastTimestamp = 0;
var deltaSeqNum = 0;

client.onerror = () => {
  console.log('connection error');
};

client.onopen = () => {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      const payload = {
        op: 'subscribe',
        args: [`snapshot:${market}`, `update:${market}`],
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
  const dedupKeysDesc = (s, d) => {
    const sortDesc = (a, b) => {
      return b - a;
    };
    const concat = Object.assign({}, s, d);
    return [...new Set(Object.keys(concat))].sort(sortDesc);
  };
  const output = (s, d, type) => {
    var diffCount = 0;
    var totalCount = 0;
    const reset = '\x1b[0m';
    const diff = '\x1b[35m';
    const askKeys = dedupKeysDesc(s, d);
    console.log(`${type}:`);
    for (const k of askKeys) {
      const sk = s ? s[k] : '';
      const dk = d ? d[k] : '';
      const color = sk === dk ? reset : diff;
      diffCount = sk === dk ? diffCount : diffCount + 1;
      totalCount += 1;
      console.log(color, `\t${k}:\t${sk} / ${dk}`);
    }
    console.log(reset);
    return {
      diff: diffCount,
      total: totalCount,
    };
  };
  const outputSummary = (diff, total, type) => {
    const ok = total - diff;
    const per = total !== 0 ? (100 * ok) / total : 0;
    console.log(`${type}: ${ok}/${total} (${per.toFixed(2)}%)`);
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
      const asks = snapOrders.asks || {};
      const bids = snapOrders.bids || {};
      snapOrders.asks = raw.data.asks.reduce(reduceFunc, asks);
      snapOrders.bids = raw.data.bids.reduce(reduceFunc, bids);
    } else if (topic.startsWith('update')) {
      // SeqNum/PrevSeqNum are used to make sure the delta data stream is continuous to construct the full snapshot.
      // If it's not then we need to reconnect to reset the delta stream.
      if (deltaSeqNum && deltaSeqNum !== data.prevSeqNum) {
        console.log(
          `ERROR: seq number not matched! (local: ${deltaSeqNum}, prev: ${data.prevSeqNum}, current: ${data.seqNum})`
        );
        client.close();
      }

      const asks = snapOrders.asks || {};
      const bids = snapOrders.bids || {};
      deltaOrders.asks = raw.data.asks.reduce(reduceFunc, asks);
      deltaOrders.bids = raw.data.bids.reduce(reduceFunc, bids);
    } else {
      console.log(`ERROR: unsupported topic: ${topic}`);
      return;
    }

    // compare the difference between snapshot and delta
    const asksResp = output(snapOrders.asks, deltaOrders.asks, 'asks (snapshot/update)');
    const bidsResp = output(snapOrders.bids, deltaOrders.bids, 'bids (snapshot/update)');

    console.log(`Market: ${market}, time diff: ${now - lastTimestamp} ms`);
    outputSummary(asksResp.diff, asksResp.total, 'asks');
    outputSummary(bidsResp.diff, bidsResp.total, 'bids');
    console.log(`seq num: ${data.seqNum}, prev: ${data.prevSeqNum}`);
    lastTimestamp = now;
  }
};

process.on('SIGINT', () => {
  client.close();
  process.exit();
});
