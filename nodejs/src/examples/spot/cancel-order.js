const axios = require('axios');
const { getSpotUrl, getAuthHeaders } = require('../../utils/common');

const cancelOrder = async ({ symbol, orderID, clOrderID }) => {
  const endpoint = '/api/v3.2/order';
  try {
    const res = await axios.delete(getSpotUrl(endpoint), {
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
  symbol: 'BTC-USD',
  clOrderID: 'test-order-placement',
})
  .then(console.log)
  .catch(console.error);
