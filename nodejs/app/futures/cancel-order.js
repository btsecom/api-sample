const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl, getAuthHeaders } = require('../utils/common');

const cancelOrder = async ({ symbol, orderID, clOrderID }) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/order`;
  try {
    const res = await axios.delete(getFuturesUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
      params: {
        symbol,
        orderID,
        clOrderID,
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

cancelOrder({
  symbol: 'BTCPFC',
  clOrderID: 'test-order-placement',
})
  .then(console.log)
  .catch(console.error);
