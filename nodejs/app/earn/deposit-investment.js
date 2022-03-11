const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const buyEarnProduct = async ({ productId, amount, renew, rate, day }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/invest/deposit`;
  const body = {
    productId,
    amount,
    renew,
    rate,
    day,
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

buyEarnProduct({
  productId: 'STAKEAXS00001',
  amount: 1,
  renew: false,
  rate: 77.224,
  day: 30,
})
  .then(console.log)
  .catch(console.error);
