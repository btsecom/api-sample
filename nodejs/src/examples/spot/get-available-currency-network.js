const axios = require('axios');
const { SPOT_API_VERSION } = require('../../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../../utils/common');

const getAvailableCurrencyNetwork = async (params) => {
  const endpoint = `/api/${SPOT_API_VERSION}/availableCurrencyNetworks`;
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

getAvailableCurrencyNetwork({
  currency: 'BTC',
})
  .then(console.log)
  .catch(console.error);
