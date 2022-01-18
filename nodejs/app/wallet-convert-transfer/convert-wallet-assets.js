const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const convertWalletAssets = async ({ amount, fromAsset, toAsset }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/user/wallet/convert`;
  const body = {
    amount,
    fromAsset,
    toAsset,
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

convertWalletAssets({
  amount: 2,
  fromAsset: 'USDT',
  toAsset: 'USD',
})
  .then(console.log)
  .catch(console.error);
