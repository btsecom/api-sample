const axios = require('axios');
const { SPOT_API_VERSION } = require('../utils/constants');
const { getSpotUrl, getAuthHeaders } = require('../utils/common');

// NOTE: currency is the "Currency-Network" pair
// where currency list can be retrieved via `GET /api/v3.2/availableCurrencies`
// and network can be retrieved via `GET /api/v3.2/availableCurrencyNetworks`
const withdrawFunds = async ({ currency, address, tag, amount }) => {
  const endpoint = `/api/${SPOT_API_VERSION}/user/wallet/withdraw`;
  const body = {
    currency,
    address,
    tag,
    amount,
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

withdrawFunds({
  currency: 'ETH-Ethereum',
  address: '0x7293D3B0f486BBB8160fE04f6Fdde0eaf147d6B6',
  tag: '',
  amount: '1',
})
  .then(console.log)
  .catch(console.error);
