const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl } = require('../utils/common');

const getMarketSummary = async () => {
  const endpoint = `/api/${SPOT_API_VERSION}/market_summary`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {});
    return res.data;
  } catch (error) {
    return error;
  }
};

getMarketSummary({}).then(console.log).catch(console.error);
