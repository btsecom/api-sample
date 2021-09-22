const webSocket = require('ws');
const { getWsOtcUrl, getAuthHeaders } = require('../../utils/common');

const url = getWsOtcUrl();
const client = new webSocket(url);

client.onerror = function () {
  console.log('Connection Error');
};

client.onopen = function () {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      // send auth
      const header = getAuthHeaders('/ws/otc');
      console.log('header: ' + JSON.stringify(header));

      const authPayload = {
        op: 'authKeyExpires',
        args: [
          header['btse-api'],
          header['btse-nonce'],
          header['btse-sign']
        ],
      };

      console.log('sending auth msg: ' + JSON.stringify(authPayload));
      client.send(JSON.stringify(authPayload));

      // send streaming quote
      // subscribe to topic
      const payload = {
        op: 'quote',
        symbol: 'BTC-SGD',
        clOrderId: 'sample-order-id',
        quantity: {
          quantity: 1000,
          currency: 'SGD',
        },
      };
      console.log('sending msg: ' + JSON.stringify(payload));
      client.send(JSON.stringify(payload));
    }
  }
  subscribe();
};

client.onclose = function () {
  console.log('echo-protocol Client Closed');
};

client.onmessage = function (e) {
  if (typeof e.data === 'string') {
    console.log(e.data);
  }
};

process.on('SIGINT', function () {
  client.close();
  process.exit();
});
