const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const placeMarketOrder = async ({
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

placeMarketOrder({
  clOrderID: 'test-order-placement',
  size: 0.0005,
  side: 'BUY',
  symbol: 'BTC-USD',
  txType: 'LIMIT',
  type: 'MARKET',
})
  .then(console.log)
  .catch(console.error);
