require('dotenv').config();
const { HmacSHA384 } = require('crypto-js');

const { API_HOST, API_KEY, API_SECRET_KEY, WS_HOST } = process.env;

const getUrl = (serviceType, endpoint) => `${API_HOST}/${serviceType}${endpoint}`;
const getSpotUrl = (endpoint) => getUrl('spot', endpoint);
const getFuturesUrl = (endpoint) => getUrl('futures', endpoint);
const getOtcUrl = (endpoint) => getUrl('otc', endpoint);
const getWsSpotUrl = () => `${WS_HOST}/spot`;
const getWsFuturesUrl = () => `${WS_HOST}/futures`;
const getWsOtcUrl = () => `${WS_HOST}/otc`;
const getWsOssSpotUrl = () => `${WS_HOST}/oss/spot`;
const getWsOssFuturesUrl = () => `${WS_HOST}/oss/futures`;

const getAuthHeaders = (endpoint, body) => {
  const nonce = Date.now().toString();
  const bodyStr = body ? JSON.stringify(body) : '';
  return {
    'request-api': API_KEY,
    'request-nonce': nonce,
    'request-sign': HmacSHA384(`${endpoint}${nonce}${bodyStr}`, API_SECRET_KEY).toString(),
  };
};

module.exports = {
  getSpotUrl,
  getFuturesUrl,
  getOtcUrl,
  getWsSpotUrl,
  getWsFuturesUrl,
  getWsOtcUrl,
  getWsOssSpotUrl,
  getWsOssFuturesUrl,
  getAuthHeaders,
};
