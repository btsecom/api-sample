import asyncio
import json
import hmac
import hashlib
import time
import websockets

from btseauth_spot import *


async def connect_forever():
    path = '/spotWS'
    url = BTSE_WSEndpoint + path
    async with websockets.connect(url) as websocket:
        # Authentication
        auth_payload = json.dumps(gen_auth(keypair['API-PASSPHRASE'], keypair['API-KEY']))
        await websocket.send(auth_payload)

        # Subscription
        payload = {'op': 'subscribe',
                   'args': ['notificationApiV1']}
        await websocket.send(json.dumps(payload))
        while True:
            msg = await websocket.recv()
            print(msg)

asyncio.get_event_loop().run_until_complete(connect_forever())