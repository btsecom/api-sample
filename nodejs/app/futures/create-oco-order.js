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

/* 
BUY / Long
The current BTCPFC price is 20200, I expect its price will downs less 20100 first and turn to ups over than 20400,
so I set a "price" to be 20100, and I also set a "triggerPrice" to be 20400 and "stopPrice" to be 20401 at the same time.

It will create 2 orders at the same time.
The order will be completed when any of the below situations occur,
and when any of the orders are completed, another order will be canceled.
1. when the price is 20100.
2. when the price ups directly without downs, it will trigger at price 20400 and attempt to buy at price 20401.
*/
placeLimitOrder({
  clOrderID: 'test-order-placement',
  size: 1,
  price: '20100',
  side: 'BUY',
  timeInForce: 'GTC',
  symbol: 'BTCPFC',
  triggerPrice: '20400',
  stopPrice: '20401',
  type: 'OCO',
  postOnly: false,
  reduceOnly: false,
  trigger: 'markPrice',
})
  .then(console.log)
  .catch(console.error);

/* 
SELL / Short
The current BTCPFC price is 20200, I expect its price will ups over 20400 first and turn to downs less than 20000,
so I set a "price" to be 20400, and I also set a "triggerPrice" to be 20101 and "stopPrice" to be 20100 at the same time.

It will create 2 orders at the same time.
The order will be completed when any of the below situations occur,
and when any of the orders are completed, another order will be canceled.
1. when the price is 20400.
2. when the price downs directly without ups, it will trigger at price 20101 and attempt to sell at price 20100.
*/
placeLimitOrder({
  clOrderID: 'test-order-placement',
  size: 1,
  price: '20400',
  side: 'SELL',
  timeInForce: 'GTC',
  symbol: 'BTCPFC',
  triggerPrice: '20101',
  stopPrice: '20100',
  type: 'OCO',
  postOnly: false,
  reduceOnly: false,
  trigger: 'markPrice',
})
  .then(console.log)
  .catch(console.error);
