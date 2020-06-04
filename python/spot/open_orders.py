import socket
import requests
import json

from btseauth_spot import *


## Get Open Orders
open_order_params = {'symbol': 'BTC-USD'}

path = '/api/v3.1/user/open_orders'
r = requests.get(
    BTSE_Endpoint+ path,
    params=open_order_params,
    headers=make_headers(path, '')
)
print (BTSE_Endpoint + path )
print(r.text)

