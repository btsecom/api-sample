import requests
from btseauth_spot import *

# get orderbook
params = {'symbol': 'BTC-USDT', 'group': 1}

path = '/api/v3.2/orderbook'
r = requests.get(
    BTSE_Endpoint+ path,
    params=params
)
#print (BTSE_Endpoint + path )
print(r.text)
