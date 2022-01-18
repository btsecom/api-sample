const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl } = require('../utils/common');

const getOrderbookL2 = async (params) => {
  const endpoint = `/api/${SPOT_API_VERSION}/orderbook/L2`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      params,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getOrderbookL2({
  symbol: 'BTC-USD',
  depth: 5,
})
  .then(console.log)
  .catch(console.error);
