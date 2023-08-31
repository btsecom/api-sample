const webSocket = require('ws');
const { getWsOtcUrl, getAuthHeaders } = require('../utils/common');

const url = getWsOtcUrl();
const client = new webSocket(url);

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

      subscribeTopic('BTC-SGD', 1, 'BTC', 'order1');
      subscribeTopic('BTC-SGD', 2, 'BTC', 'order2');
      subscribeTopic('BTC-SGD', 3, 'BTC', 'order3');
      subscribeTopic('BTC-SGD', 4, 'BTC', 'order4');
      subscribeTopic('BTC-SGD', 5, 'BTC', 'order5');
    }
  }
  subscribe();
};

client.onclose = () => {
  console.log('echo-protocol client closed');
};

client.onmessage = (e) => {
  if (typeof e.data === 'string') {
    console.log(e.data);
    console.log('');
  }
};

process.on('SIGINT', () => {
  client.close();
  process.exit();
});
