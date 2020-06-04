import hmac
import time
import hashlib

#Production
BTSE_Endpoint = 'https://api.btse.com/futures'

# Testnet
# BTSE_Endpoint = 'https://testapi.btse.io/futures'

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