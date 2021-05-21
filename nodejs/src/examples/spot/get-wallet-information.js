const axios = require('axios');
const { getSpotUrl, getAuthHeaders } = require('../../utils/common');

const getWalletInformation = async () => {
  const endpoint = '/api/v3.2/user/wallet';
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getWalletInformation().then(console.log).catch(console.error);
