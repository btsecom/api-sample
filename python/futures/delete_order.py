import socket
import requests
import json


from btseauth_futures import *



## Delete an order
cancel_params = {'orderID': '6563bb90-780b-45c5-90b9-c5ea0f4cd5f8', 'symbol': 'BTCPFC'}

path = '/api/v2.1/order'
r = requests.delete(
    BTSE_Endpoint+ path,
    params=cancel_params,
    headers=make_headers(path, '')
)
print (BTSE_Endpoint + path )
print(r.text)


