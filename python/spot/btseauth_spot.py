import hmac
import time
import hashlib
import os
from typing import (
    Dict,
)

#Production
BTSE_Endpoint = 'https://api.btse.com/spot'
BTSE_WSEndpoint = 'wss://ws.btse.com'


# Testnet
# BTSE_WSEndpoint = 'wss://testws.btse.io'
# BTSE_Endpoint = 'https://testapi.btse.io/spot'

# API Keys
keypair = {
    'API-KEY': '',
    'API-PASSPHRASE': ''
}



##Make Signature headers
def make_headers(path, data):
    nonce = str(int(time.time()*1000))
    message = path + nonce + data

    headers = {}
    
    signature = hmac.new(
        bytes(keypair['API-PASSPHRASE'], 'latin-1'),
        msg=bytes(message, 'latin-1'),
        digestmod=hashlib.sha384
    ).hexdigest()
    headers = {
        'btse-api':keypair['API-KEY'],
        'btse-nonce':nonce,
        'btse-sign':signature
    }
    return headers

def gen_auth(api_key, secret_key, path='/spotWS'):
    btsenonce = str(int(time.time()*1000))
    path = path + btsenonce + ''
    signature = hmac.new(
        bytes(secret_key, 'latin-1'),
        msg=bytes(path, 'latin-1'),
        digestmod=hashlib.sha384
    ).hexdigest()
    auth_payload = {
        'op': 'authKeyExpires',
        'args': [api_key, btsenonce, signature + ""]
    }
    return auth_payload    



# get from environment variables
api_key = os.environ['BTSE_API_KEY']
secret_key = os.environ['BTSE_SECRET_KEY']

# methods for keeping track of last nonce in trading environments
_last_tracking_nonce: int = 0

def get_tracking_nonce() -> str:
    global _last_tracking_nonce
    nonce = int(time.time() * 1000)
    _last_tracking_nonce = nonce if nonce > _last_tracking_nonce else _last_tracking_nonce + 1
    return str(_last_tracking_nonce)


def get_headers(path_url: str, data: str = "") -> Dict[str, any]:
    """
    Generates authentication headers required by btse
    :param path_url: e.g. "/accounts"
    :param data: request payload
    :return: a dictionary of auth headers
    """

    nonce = get_tracking_nonce()
    print(f'\nget_tracking_nonce: {nonce}')

    message = path_url + nonce + data
    print(f'MESSAGE: {message}')

    signature = hmac.new(
        bytes(secret_key, 'latin-1'),
        msg=bytes(message, 'latin-1'),
        digestmod=hashlib.sha384
    ).hexdigest()

    headers = {
        'btse-api': api_key,
        'btse-nonce': nonce,
        'btse-sign': signature,
        'Accept': 'application/json;charset=UTF-8',
        'Content-Type': 'application/json',
    }
    return headers