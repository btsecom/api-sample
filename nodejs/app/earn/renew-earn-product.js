const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const renewEarnProduct = async ({ orderId, autoRenew }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/invest/renew`;
  const body = {
    orderId,
    autoRenew,
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

renewEarnProduct({
  orderId: 12537,
  autoRenew: false,
})
  .then(console.log)
  .catch(console.error);
