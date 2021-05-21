const axios = require('axios');
const { FUTURES_API_VERSION } = require('../../utils/constants');
const { getFuturesUrl, getAuthHeaders } = require('../../utils/common');

const getWalletInformation = async () => {
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

getWalletInformation().then(console.log).catch(console.error);
