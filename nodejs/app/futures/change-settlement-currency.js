const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl, getAuthHeaders } = require('../utils/common');

const changeSettlementCurrency = async ({
  symbol,
  currency,
}) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/settle_in`;
  const body = {
    symbol,
    currency,
  };
  try {
    const res = await axios.post(getFuturesUrl(endpoint), body, {
      headers: getAuthHeaders(endpoint, body),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

changeSettlementCurrency({
  symbol: 'ETHPFC',
  currency: 'ETH',
})
  .then(console.log)
  .catch(console.error);
