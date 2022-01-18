const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl, getAuthHeaders } = require('../utils/common');

const getWalletMargin = async (params) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/user/margin`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
      params,
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getWalletMargin({
  symbol: 'BTCPFC',
})
  .then(console.log)
  .catch(console.error);
