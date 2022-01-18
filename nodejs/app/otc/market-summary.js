const axios = require('axios');
const { OTC_API_VERSION } = require('../utils/constants');
const { getOtcUrl } = require('../utils/common');

const getMarketSummary = async () => {
  const endpoint = `/api/${OTC_API_VERSION}/getMarket`;
  try {
    const res = await axios.get(getOtcUrl(endpoint), {});
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getMarketSummary({}).then(console.log).catch(console.error);
