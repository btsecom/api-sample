import socket
import requests
import json


from btseauth_futures import *



# Place a limit order
limit_order_form = {
  'size': 1,
  'price': 7000,
  'side': 'BUY',
  'time_in_force': 'GTC',
  'symbol': 'BTCPFC',
  'type': 'MARKET',
  'txType': 'LIMIT',
  'postOnly': False,
  'reduceOnly': False,
  'triggerPrice': 0
}

path = '/api/v2.1/order'
r = requests.post(
    BTSE_Endpoint+path,
    json=limit_order_form,
    headers=make_headers(path, json.dumps(limit_order_form))
)
print(r.text)



