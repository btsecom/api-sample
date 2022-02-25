const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl } = require('../utils/common');

const getMarketPrice = async (params) => {
  const endpoint = `/api/${SPOT_API_VERSION}/price`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      params,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getMarketPrice({
  symbol: 'BTC-USD',
})
  .then(console.log)
  .catch(console.error);
