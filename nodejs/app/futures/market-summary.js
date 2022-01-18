const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl } = require('../utils/common');

const getMarketSummary = async () => {
  const endpoint = `/api/${FUTURES_API_VERSION}/market_summary`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {});
    return res.data;
  } catch (error) {
    return error;
  }
};

getMarketSummary({}).then(console.log).catch(console.error);
