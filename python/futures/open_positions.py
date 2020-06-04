import socket
import requests
import json


from btseauth_futures import *



## Get all Positions
path = '/api/v2.1/user/positions'
body = ''
make_headers(path,body)
r = requests.get(BTSE_Endpoint + path, headers=make_headers(path, body))

print(r.text)


