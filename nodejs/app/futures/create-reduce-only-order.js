const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl, getAuthHeaders } = require('../utils/common');

const placeReduceOnlyOrder = async ({
  size,
  price,
  side,
  timeInForce,
  type,
  symbol,
  txType,
  postOnly,
  reduceOnly,
  triggerPrice,
  stopPrice,
  trailValue,
  clOrderID,
  trigger,
}) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/order`;
  const body = {
    size,
    price,
    side,
    time_in_force: timeInForce,
    type,
    symbol,
    txType,
    postOnly,
    reduceOnly,
    triggerPrice,
    stopPrice,
    trailValue,
    clOrderID,
    trigger,
  };
  try {
    const res = await axios.post(getFuturesUrl(endpoint), body, {
      headers: getAuthHeaders(endpoint, body),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

placeReduceOnlyOrder({
  clOrderID: 'test-reduce-only-order-placement',
  size: 1,
  price: 49000,
  side: 'SELL',
  timeInForce: 'GTC',
  symbol: 'BTCPFC',
  type: 'LIMIT',
  txType: 'LIMIT',
  reduceOnly: true,
})
  .then(console.log)
  .catch(console.error);
