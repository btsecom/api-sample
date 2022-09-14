const axios = require('axios');
const { FUTURES_API_VERSION } = require('../utils/constants');
const { getFuturesUrl, getAuthHeaders } = require('../utils/common');

const placeLimitOrder = async ({
  size,
  price,
  side,
  timeInForce,
  type,
  symbol,
  postOnly,
  reduceOnly,
  triggerPrice,
  stopPrice,
  clOrderID,
  trigger,
}) => {
  const endpoint = `/api/${FUTURES_API_VERSION}/order`;
  const body = {
    size,
    price,
    side,
    time_in_force: timeInForce,
    type,
    symbol,
    postOnly,
    reduceOnly,
    triggerPrice,
    stopPrice,
    clOrderID,
    trigger,
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

placeLimitOrder({
  clOrderID: 'test-order-placement',
  size: 1,
  price: '20200',
  side: 'BUY',
  timeInForce: 'GTC',
  symbol: 'BTCPFC',
  triggerPrice: '20400',
  type: 'OCO',
  postOnly: false,
  reduceOnly: false,
  stopPrice: '20401',
  trigger: 'markPrice',
})
  .then(console.log)
  .catch(console.error);
