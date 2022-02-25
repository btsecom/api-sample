const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl } = require('../utils/common');

const getOrderbook = async (params) => {
  const endpoint = `/api/${SPOT_API_VERSION}/orderbook`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      params,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getOrderbook({
  symbol: 'BTC-USDT',
  group: 1,
  limit_bids: 5,
  limit_asks: 10,
})
  .then(console.log)
  .catch(console.error);
