const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl } = require('../utils/common');

const getOhlcv = async (params) => {
  const endpoint = `/api/${SPOT_API_VERSION}/ohlcv`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      params,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getOhlcv({
  symbol: 'BTC-USD',
  resolution: '30',
})
  .then(console.log)
  .catch(console.error);
