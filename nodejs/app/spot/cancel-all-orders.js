const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const cancelAllAfter = async ({ timeout }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/order/cancelAllAfter`;
  const body = {
    timeout,
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

cancelAllAfter({
  timeout: 1638460701,
})
  .then(console.log)
  .catch(console.error);
