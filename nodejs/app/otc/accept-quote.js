const axios = require('axios');
const { OTC_API_VERSION } = require('../utils/constants');
const { getOtcUrl, getAuthHeaders } = require('../utils/common');
const { getOtcQuote } = require('./request-for-quote');

const acceptOtcQuote = async ({ quoteId, baseAmount, quoteAmount }) => {
  const endpoint = `/api/${OTC_API_VERSION}/accept/${quoteId}`;
  const body = {
    baseAmount,
    quoteAmount,
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
  orderSizeInBaseCurrency: 1,
  orderAmountInOrderCurrency: 0,
})
  .then((resp) => {
    console.log(`resp: ${JSON.stringify(resp)}`);
    const { status, quoteId } = resp;
    if (status !== 30001 || !quoteId) {
      console.log('ERROR: failed to get otc quote');
    } else {
      acceptOtcQuote({
        quoteId,
        baseAmount: 0.5,
        quoteAmount: 0,
      })
        .then(console.log)
        .catch(console.error);
    }
  })
  .catch(console.error);
