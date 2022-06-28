const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl, getAuthHeaders } = require('../utils/common');

const getTradeHistory = async (params) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/user/trade_history`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
      params,
      headers: getAuthHeaders(endpoint),
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

getTradeHistory({
  symbol: 'BTCPFC',
}).then(console.log).catch(console.error);
