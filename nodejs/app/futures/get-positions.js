const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl, getAuthHeaders } = require('../utils/common');

const getPositions = async ({ symbol }) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/user/positions`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
      params: { symbol },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getPositions({
  symbol: 'BTCPFC',
})
  .then(console.log)
  .catch(console.error);
