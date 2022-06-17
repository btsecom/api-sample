const webSocket = require('ws');
const { getWsOtcUrl } = require('../utils/common');

const url = getWsOtcUrl();
const client = new webSocket(url);

client.onerror = () => {
  console.log('connection error');
};

client.onopen = () => {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      // send streaming quote
      // subscribe to topic
      const subscribeTopic = (op, symbol, quantity, currency, clOrderId = '') => {
        const payload = {
          op,
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

      // subscribe
      subscribeTopic('quote', 'BTC-EUR', 0.5, 'BTC', 'order1');
      subscribeTopic('quote', 'BTC-EUR', 1, 'BTC', 'order2');
      subscribeTopic('quote', 'BTC-EUR', 5, 'BTC', 'order3');
      subscribeTopic('quote', 'BTC-EUR', 10, 'BTC', 'order4');
      subscribeTopic('quote', 'BTC-EUR', 20, 'BTC', 'order5');

      // unsubscribe-all
      client.send(JSON.stringify({ op: 'unsubscribe-quote-all' }));
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
