const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const createWalletAddress = async ({ currency }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/user/wallet/address`;
  const body = {
    currency,
  };
  try {
    const res = await axios.post(getSpotUrl(endpoint), body, {
      headers: getAuthHeaders(endpoint, body),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

createWalletAddress({
  currency: 'BTC',
})
  .then(console.log)
  .catch(console.error);
