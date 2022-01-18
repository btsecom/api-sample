const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl } = require('../utils/common');

const getOrderbookL2 = async (params) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/orderbook/L2`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
      params,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getOrderbookL2({
  symbol: 'BTCPFC',
  depth: 10,
})
  .then(console.log)
  .catch(console.error);
