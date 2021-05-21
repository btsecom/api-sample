const axios = require('axios');
const { getFuturesUrl, getAuthHeaders } = require('../../utils/common');

const cancelOrder = async ({ symbol, orderID, clOrderID }) => {
  const endpoint = '/api/v2.1/order';
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
