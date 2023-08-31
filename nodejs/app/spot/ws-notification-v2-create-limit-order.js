const webSocket = require('ws');
const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getAuthHeaders, getWsSpotUrl, getSpotUrl } = require('../utils/common');

const clOrderID = 'test-order-placement';

const cancelOrder = async (params) => {
  const endpoint = `/api/${SPOT_API_VERSION}/order`;
  const res = await axios.delete(getSpotUrl(endpoint), {
    headers: getAuthHeaders(endpoint),
    params,
  });
  return res.data;
};

const placeLimitOrder = async ({
  clOrderID,
  deviation,
  postOnly,
  price,
  side,
  size,
  stealth,
  stopPrice,
  symbol,
  timeInForce,
  trailValue,
  triggerPrice,
  txType,
  type,
}) => {
  const endpoint = `/api/${SPOT_API_VERSION}/order`;
  const body = {
    clOrderID,
    deviation,
    postOnly,
    price,
    side,
    size,
    stealth,
    stopPrice,
    symbol,
    time_in_force: timeInForce,
    trailValue,
    triggerPrice,
    txType,
    type,
  };
  const res = await axios.post(getSpotUrl(endpoint), body, {
    headers: getAuthHeaders(endpoint, body),
  });
  return res.data;
};

const client = new webSocket(getWsSpotUrl());

client.onerror = () => {
  console.log('connection error');
};

client.onopen = () => {
  function subscribe() {
    if (client.readyState === client.OPEN) {
      // send auth
      const header = getAuthHeaders('/ws/spot');
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
        args: ['notificationApiV2'],
      };
      console.log('sending msg: ' + JSON.stringify(payload));
      client.send(JSON.stringify(payload));

      console.log('\n\nwaiting for order to be transacted...\n\n');

      placeLimitOrder({
        clOrderID,
        size: 0.002,
        price: 0.5,
        side: 'BUY',
        timeInForce: 'GTC',
        symbol: 'BTC-USD',
        txType: 'LIMIT',
        triggerPrice: 0,
        type: 'LIMIT',
      }).catch(console.error);
    }
  }
  subscribe();
};

client.onclose = () => {
  console.log('echo-protocol client closed');
};

client.onmessage = (e) => {
  if (typeof e.data === 'string') {
    console.log("Received: '" + e.data + "'");

    const payload = JSON.parse(e.data);
    if (payload.data && payload.data.clOrderID === clOrderID) {
      switch (payload.data.status) {
        // 2: ORDER_INSERTED = Order is inserted successfully
        case 2: {
          console.log('Order is inserted successfully');
          cancelOrder({
            symbol: 'BTC-USD',
            clOrderID,
          }).catch(console.error);
          return;
        }
        // 4: ORDER_FULLY_TRANSACTED = Order is fully transacted
        case 4: {
          console.log('Order is fully transacted');
          return;
        }
        // 5: ORDER_PARTIALLY_TRANSACTED = Order is partially transacted
        case 5: {
          console.log('Order is partially transacted');
          return;
        }
        // 6: ORDER_CANCELLED = Order is cancelled successfully
        // 15: ORDER_REJECTED = Order is rejected
        case 6:
        case 15: {
          console.log('Order is cancelled successfully');
          return;
        }
      }
    }
  }
};

process.on('SIGINT', () => {
  client.close();
  process.exit();
});
