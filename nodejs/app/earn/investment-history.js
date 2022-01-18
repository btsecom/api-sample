const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

const getEarnHistory = async ({ pageNumber, pageSize }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/invest/history`;
  try {
    const res = await axios.get(getSpotUrl(endpoint), {
      headers: getAuthHeaders(endpoint),
      params: {
        pageNumber,
        pageSize,
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getEarnHistory({
  pageNumber: 2,
  pageSize: 3,
})
  .then(console.log)
  .catch(console.error);
