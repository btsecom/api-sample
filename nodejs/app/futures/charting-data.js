const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl } = require('../utils/common');

const getOhlcv = async (params) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/ohlcv`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
      params,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getOhlcv({
  symbol: 'BTCPFC',
  resolution: 15,
})
  .then(console.log)
  .catch(console.error);
