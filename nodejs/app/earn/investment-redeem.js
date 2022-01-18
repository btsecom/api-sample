const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const redeemEarnProduct = async ({ orderId, amount }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/invest/redeem`;
  const body = {
    orderId,
    amount,
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

redeemEarnProduct({
  orderId: 12537,
  amount: 1,
})
  .then(console.log)
  .catch(console.error);
