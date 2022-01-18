const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl } = require('../utils/common');

const getOrderbook = async (params) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/orderbook`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
      params,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getOrderbook({
  symbol: 'BTCPFC',
  group: 2,
})
  .then(console.log)
  .catch(console.error);
