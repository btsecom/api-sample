import requests
from btseauth_futures import *

# get orderbook
params = {'symbol': 'ETHPFC', 'group': 2}

path = '/api/v2.1/orderbook'
r = requests.get(
    BTSE_Endpoint+ path,
    params=params
)
#print (BTSE_Endpoint + path )
print(r.text)
