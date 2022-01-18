const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const getWalletHistory = async ({ currency }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/user/wallet_history`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
      params: {
        currency,
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getWalletHistory({
  currency: 'USD',
})
  .then(console.log)
  .catch(console.error);
