const webSocket = require('ws');
const { getAuthHeaders, getWsFuturesUrl } = require('../utils/common');

const client = new webSocket(getWsFuturesUrl());

client.onerror = () => {
  console.log('connection error');
};

client.onopen = () => {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      // send auth
      const header = getAuthHeaders('/ws/futures');
      console.log('header: ' + JSON.stringify(header));

      const authPayload = {
        op: 'authKeyExpires',
        args: [header['request-api'], header['request-nonce'], header['request-sign']],
      };

      console.log('sending auth msg: ' + JSON.stringify(authPayload));
      client.send(JSON.stringify(authPayload));

      // subscribe to notification api websocket
      const payload = {
        op: 'subscribe',
        args: ['allPosition'],
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
  if (typeof e.data === 'string') {
    const obj = JSON.parse(e.data);
    console.log(JSON.stringify(obj, undefined, 2));
  }
};

process.on('SIGINT', () => {
  client.close();
  process.exit();
});
