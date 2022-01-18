const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const cancelOrder = async (params) => {
  const endpoint = `/api/${SPOT_API_VERSION}/order`;
  try {
    const res = await axios.delete(getSpotUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
      params,
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

cancelOrder({
  symbol: 'BTC-USD',
  clOrderID: 'test-order-placement',
})
  .then(console.log)
  .catch(console.error);
