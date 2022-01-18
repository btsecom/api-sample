const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl, getAuthHeaders } = require('../utils/common');

const getWalletBalance = async () => {
  const endpoint = `/api/${FUTURES_API_VERSION}/user/wallet`;
  try {
    const res = await axios.get(getFuturesUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getWalletBalance().then(console.log).catch(console.error);
