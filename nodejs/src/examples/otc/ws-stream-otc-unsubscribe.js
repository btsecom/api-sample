const webSocket = require('ws');
const { getWsOtcUrl, getAuthHeaders } = require('../../utils/common');

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
      subscribeTopic('op', 'BTC-EUR', 1, 'EUR', 'order1');
      subscribeTopic('op', 'BTC-EUR', 2, 'EUR', 'order2');

      // unsubscribe
      subscribeTopic('unsubscribe-quote', 'BTC-EUR', 1, 'EUR', 'order2');
      subscribeTopic('unsubscribe-quote', 'BTC-EUR', 2, 'EUR', 'order2');
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
