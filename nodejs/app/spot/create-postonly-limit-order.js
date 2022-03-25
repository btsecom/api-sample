const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const placeReduceOnlyLimitOrder = async ({
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
  try {
    const res = await axios.post(getSpotUrl(endpoint), body, {
      headers: getAuthHeaders(endpoint, body),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

placeReduceOnlyLimitOrder({
  clOrderID: 'test-order-placement',
  size: 0.002,
  price: 0.5,
  side: 'BUY',
  timeInForce: 'GTC',
  symbol: 'BTC-USD',
  txType: 'LIMIT',
  triggerPrice: 0,
  type: 'LIMIT',
  postOnly: true,
})
  .then(console.log)
  .catch(console.error);
