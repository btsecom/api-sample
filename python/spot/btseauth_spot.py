import hmac
import time
import hashlib

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