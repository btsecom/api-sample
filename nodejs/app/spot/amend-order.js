const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const amendOrder = async ({ symbol, orderID, clOrderID, type, value, slide }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/order`;
  const body = {
    symbol,
    orderID,
    clOrderID,
    type,
    value,
    slide,
  };
  try {
    const res = await axios.put(getSpotUrl(endpoint), body, {
      headers: getAuthHeaders(endpoint, body),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

amendOrder({
  symbol: 'BTC-USD',
  clOrderID: 'test-order-placement',
  type: 'SIZE',
  value: 0.005,
})
  .then(console.log)
  .catch(console.error);
