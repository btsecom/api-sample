const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl } = require('../utils/common');

const getTrades = async (params) => {
  const endpoint = `/api/${SPOT_API_VERSION}/trades`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      params,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getTrades({
  symbol: 'BTC-USD',
})
  .then(console.log)
  .catch(console.error);
