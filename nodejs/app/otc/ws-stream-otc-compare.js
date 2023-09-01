const webSocket = require('ws');
const { getWsOtcUrl, getAuthHeaders } = require('../utils/common');

const url = getWsOtcUrl();
const client = new webSocket(url);
const result = {}

function _sortOnKeys(dict) {

  const sorted = [];
  for(const key in dict) {
    sorted[sorted.length] = key;
  }
  sorted.sort((a, b) => parseFloat(a) - parseFloat(b));

  const array = [];
  for(let i = 0; i < sorted.length; i++) {
    array.push(dict[sorted[i]]);
  }

  return array;
}

client.onerror = () => {
  console.log('connection error');
};

client.onopen = () => {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      // send auth
      const header = getAuthHeaders('/ws/otc');
      console.log('header: ' + JSON.stringify(header));

      const authPayload = {
        op: 'authKeyExpires',
        args: [header['request-api'], header['request-nonce'], header['request-sign']],
      };

      console.log('sending auth msg: ' + JSON.stringify(authPayload));
      client.send(JSON.stringify(authPayload));

      // send streaming quote
      // subscribe to topic
      const subscribeTopic = (symbol, quantity, currency, clOrderId = '') => {
        const payload = {
          op: 'quote',
          symbol,
          clOrderId,
          quantity: {
            quantity,
            currency,
          },
        };

        console.log('sending msg: ' + JSON.stringify(payload));
        client.send(JSON.stringify(payload));
      };

      subscribeTopic('BTC-USD', 0.1, 'BTC', '');
      subscribeTopic('BTC-USD', 0.2, 'BTC', '');
      subscribeTopic('BTC-USD', 0.3, 'BTC', '');
      subscribeTopic('BTC-USD', 0.5, 'BTC', '');
      subscribeTopic('BTC-USD', 0.75, 'BTC', '');
      subscribeTopic('BTC-USD', 1, 'BTC', '');
      subscribeTopic('BTC-USD', 2, 'BTC', '');
      subscribeTopic('BTC-USD', 5, 'BTC', '');
      subscribeTopic('BTC-USD', 20, 'BTC', '');
      subscribeTopic('BTC-USD', 50, 'BTC', '');
    }
  }
  subscribe();
};

client.onclose = () => {
  console.log('echo-protocol client closed');
};

client.onmessage = (e) => {
  if (typeof e.data === 'string') {
    const {
      symbol,
      buyQuantity: amount,
      buyUnitPrice,
      sellUnitPrice,
      timestamp
    } = JSON.parse(e.data);


    if (!symbol || !amount || !buyUnitPrice || !sellUnitPrice) {
      return;
    }

    const rounded = Math.round(amount * 100, 2) / 100;
    result[rounded] = {
      symbol,
      rounded,
      buyUnitPrice,
      sellUnitPrice,
      timestamp,
    };

    console.table(_sortOnKeys(result));
    console.log();
  }
};

process.on('SIGINT', () => {
  client.close();
  process.exit();
});
