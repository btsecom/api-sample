const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const getTradeHistory = async ({ symbol }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/user/trade_history`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
      params: {
        symbol,
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getTradeHistory({
  symbol: 'BTC-USD',
})
  .then(console.log)
  .catch(console.error);
