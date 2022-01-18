const axios = require('axios');
const { OTC_API_VERSION } = require('../utils/constants');
const { getOtcUrl, getAuthHeaders } = require('../utils/common');

const getOtcQuote = async ({ baseCurrency, orderCurrency, side, orderAmountInOrderCurrency }) => {
  const endpoint = `/api/${OTC_API_VERSION}/quote`;
  const body = {
    baseCurrency,
    orderCurrency,
    side,
    orderAmountInOrderCurrency,
  };
  try {
    const res = await axios.post(getOtcUrl(endpoint), body, {
      headers: getAuthHeaders(endpoint, body),
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

getOtcQuote({
  baseCurrency: 'BTC',
  orderCurrency: 'USD',
  side: 'buy',
  orderAmountInOrderCurrency: 1,
})
  .then(console.log)
  .catch(console.error);

module.exports = {
  getOtcQuote,
};
