const axios = require('axios');
const { OTC_API_VERSION } = require('../utils/constants');
const { getOtcUrl, getAuthHeaders } = require('../utils/common');

const getOtcQuote = async ({ baseCurrency, orderCurrency, side, orderSizeInBaseCurrency, orderAmountInOrderCurrency, clientOrderId }) => {
  const endpoint = `/api/${OTC_API_VERSION}/quote`;
  const body = {
    baseCurrency,
    orderCurrency,
    side,
    orderSizeInBaseCurrency,
    orderAmountInOrderCurrency,
    clientOrderId,
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
  orderCurrency: 'JPY',
  side: 'buy',
  orderSizeInBaseCurrency: 1,
  orderAmountInOrderCurrency: 0, // either orderSizeInBaseCurrency/orderAmountInOrderCurrency has to be non-zero
  clientOrderId: 'my-test-client-order-id',
})
  .then(console.log)
  .catch(console.error);

module.exports = {
  getOtcQuote,
};
