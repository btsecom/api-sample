const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const getEarnProducts = async () => {
  const endpoint = `/api/${SPOT_API_VERSION}/invest/products`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

getEarnProducts()
  .then((x) => console.log(JSON.stringify(x)))
  .catch(console.error);
