const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl } = require('../utils/common');

const getMarketPrice = async (params) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/price`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
      params,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getMarketPrice({
  symbol: 'BTCPFC',
})
  .then(console.log)
  .catch(console.error);
