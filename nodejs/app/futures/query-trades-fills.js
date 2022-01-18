const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl } = require('../utils/common');

const getTrades = async (params) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/trades`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
      params,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getTrades({
  symbol: 'BTCPFC',
  count: 10,
})
  .then(console.log)
  .catch(console.error);
