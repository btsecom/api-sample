const axios = require('axios');
const { getFuturesUrl, getAuthHeaders } = require('../../utils/common');

const getOpenOrders = async ({ symbol, orderID, clOrderID }) => {
  const endpoint = '/api/v2.1/user/open_orders';
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
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
  symbol: 'BTCPFC',
})
  .then(console.log)
  .catch(console.error);
