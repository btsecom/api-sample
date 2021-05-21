const axios = require('axios');
const { getSpotUrl, getAuthHeaders } = require('../../utils/common');

const getOpenOrders = async ({ symbol, orderID, clOrderID }) => {
  const endpoint = '/api/v3.2/user/open_orders';
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
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

getOpenOrders({
  symbol: 'BTC-USD',
})
  .then(console.log)
  .catch(console.error);
