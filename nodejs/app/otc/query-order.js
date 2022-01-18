const axios = require('axios');
const { OTC_API_VERSION } = require('../utils/constants');
const { getOtcUrl, getAuthHeaders } = require('../utils/common');

const getOtcOrder = async ({ quoteId }) => {
  const endpoint = `/api/${OTC_API_VERSION}/queryOrder/${quoteId}`;
  const body = {};
  try {
    const res = await axios.post(getOtcUrl(endpoint), body, {
      headers: getAuthHeaders(endpoint, body),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getOtcOrder({
  quoteId: 'ddcf3d98-39e7-41fb-b7d1-de53e9910224',
})
  .then(console.log)
  .catch(console.error);
