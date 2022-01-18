const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const placePegOrder = async ({
  clOrderID,
  symbol,
  price,
  size,
  side,
  timeInForce,
  type,
  txType,
  stopPrice,
  triggerPrice,
  trailValue,
  postOnly,
  stealth,
  deviation,
}) => {
  const endpoint = `/api/${SPOT_API_VERSION}/order/peg`;
  const body = {
    clOrderID,
    symbol,
    price,
    size,
    side,
    time_in_force: timeInForce,
    type,
    txType,
    stopPrice,
    triggerPrice,
    trailValue,
    postOnly,
    stealth,
    deviation,
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

placePegOrder({
  clOrderID: 'test-peg-order-placement',
  symbol: 'BTC-USD',
  price: 4000,
  size: 0.0015,
  side: 'BUY',
  type: 'LIMIT',
  txType: 'LIMIT',
  triggerPrice: 5000,
  stealth: 10,
  deviation: 1,
})
  .then(console.log)
  .catch(console.error);
