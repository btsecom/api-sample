import socket
import requests
import json

from btseauth_spot import *


## Delete an order
cancel_params = {'orderID': 'e75fbc83-fd14-4c2b-b06f-f80533eed7cc', 'symbol': 'BTC-USD'}

path = '/api/v3.1/order'
r = requests.delete(
    BTSE_Endpoint+ path,
    params=cancel_params,
    headers=make_headers(path, '')
)
print (BTSE_Endpoint + path )
print(r.text)

