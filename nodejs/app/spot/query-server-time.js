const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl } = require('../utils/common');

const getTime = async () => {
  const endpoint = `/api/${SPOT_API_VERSION}/time`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {});
    return res.data;
  } catch (error) {
    return error;
  }
};

getTime({}).then(console.log).catch(console.error);
