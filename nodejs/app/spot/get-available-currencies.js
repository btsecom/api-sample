const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const getAvailableCurrencies = async (params) => {
  const endpoint = `/api/${SPOT_API_VERSION}/availableCurrencies`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
      params,
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getAvailableCurrencies({
  action: 'CONVERT',
})
  .then(console.log)
  .catch(console.error);
