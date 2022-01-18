const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const transferWalletAssets = async ({ amount, asset, toUser, toUserMail }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/user/wallet/transfer`;
  const body = {
    amount,
    asset,
    toUser,
    toUserMail,
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

transferWalletAssets({
  amount: 2,
  asset: 'USDT',
  toUser: 'joe01032002',
  toUserMail: 'joe01032002@gmail.com',
})
  .then(console.log)
  .catch(console.error);
