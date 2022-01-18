const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl, getAuthHeaders } = require('../utils/common');

const getWalletHistory = async () => {
  const endpoint = `/api/${FUTURES_API_VERSION}/user/wallet_history`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

getWalletHistory().then(console.log).catch(console.error);
