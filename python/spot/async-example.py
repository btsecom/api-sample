import asyncio
import aiohttp
from btseauth_spot import get_headers
from decimal import Decimal
import json
import time

'''
 Use this Test script to make sure that limit orders can be 
 placed, status checked, and cancelled using asyncio
'''

symbol = "BTC-USDT"
side = 'BUY'
price = 18038.5

BTSE_Endpoint = 'https://testapi.btse.io/spot'
open_order_params = {'symbol':  symbol}
path = '/api/v3.2/user/open_orders'
url = BTSE_Endpoint+path

from typing import (
    Dict,
)

limit_path = '/api/v3.2/order'
limit_url = BTSE_Endpoint+path

ts = int(time.time())
clientOID = f"buy-{symbol}-" + str(ts)


limit_order_form = {"symbol": f"{symbol}",
                    "side": f"{side}", 
                    "type": "LIMIT", 
                    "price": f"{price}", # implement check price limit
                    "size": "0.012",  ## implement check size
                    "time_in_force": "GTC", 
                    "txType": "LIMIT", 
                    "clOrderID": f"{clientOID}"}

#######
cancel_path = '/api/v3.2/order'

# use these dicts for deletion of open orders
def get_cancelparams(trade_msg: Dict[str, any]): 
    pairs = []
    for trade in trade_msg:
        symbol = trade['symbol']
        oid = trade['orderID']
        info = {'symbol': symbol, 'orderID': oid}
        pairs.append(info)
    return pairs


async def get_openorders(client, path, params):
    try:
        headers = get_headers(path, '')
        url = BTSE_Endpoint+path
        print(f'url: {url} params: {params} headers: {headers}')
        async with client.request('get', url=url, params=params, headers=headers) as response:
            result = await response.json()
            print(f"get_openorders: {url} ")
            return result
    except Exception as e: 
        print(e)


# make the headers and then pass into _api_request, because they are different
# for every type of request, be it buy/sell, cancel or get open orders
async def limit_order(client,
                      path, 
                      params):
    try:
        jsond = json.dumps(params)
        headers = get_headers(path, jsond)
        url = BTSE_Endpoint+path
        print(f"\n INSIDE CLIENT.POST: url: {url}, json: {jsond}, headers: {headers}\n")
        async with client.request('post', url=url, json=params, headers=headers) as response:
            r = await response.json()
            print("posting limit_order ")
            return r
    except Exception as e:
        print(f"Exception thrown as {e}")


async def cancel_orders(client, 
                        path, 
                        params):
    try:
        headers = get_headers(path, '')
        url = BTSE_Endpoint+path
        async with client.request('delete', url=url, params=params, headers=headers) as response:
            r = await response.text()
            print(" cancelling order .....  \n")
            print(r)
            return r
    except Exception as e:
        print(e)


async def cancel_all_orders(session, responses):
    for r in responses:
        print(r)
        print(r[0]['orderType'])
        ordertype = r[0]['orderType']
        if ordertype == 76: 
            print("order type is 76") # orderState is STATUS_ACTIVE, orderType is 76
            pairs = get_cancelparams(r)
            print(f'Total number of pairs: {len(pairs)}\n\n')
            print(pairs[0])
            cancel_tasks = []
            for p in pairs:
                task = asyncio.ensure_future(cancel_orders(client=session, path=cancel_path, params=p))
                cancel_tasks.append(task)
            responses = await asyncio.gather(*cancel_tasks)
            print(f'length of responses from cancel tasks: {len(responses)}')


async def place_orders():
    # place two orders
    tasks = []
    async with aiohttp.ClientSession() as session:
        task2 = asyncio.ensure_future(limit_order(client=session, path=limit_path, params=limit_order_form))
        tasks.append(task2)
        task3 = asyncio.ensure_future(limit_order(client=session, path=limit_path, params=limit_order_form))
        tasks.append(task3)
        responses = await asyncio.gather(*tasks)
        print(f'place order length of responses: {len(responses)} \n\n')
        print(responses)
        await session.close()


async def run(r):
    # place 2 limit orders, get all open orders, cancel all open orders
    tasks = []
    await place_orders()
    async with aiohttp.ClientSession() as session:
        # get all open orders, including the two above
        task = asyncio.ensure_future(get_openorders(client=session, path=path, params=open_order_params))
        tasks.append(task)
        responses = await asyncio.gather(*tasks)
        print(f'length of responses: {len(responses)} \n\n')
        print(responses)
        print(f'end of length of responses\n\n')
        # cancel all open orders
        await cancel_all_orders(session, responses)
        await session.close()


loop = asyncio.get_event_loop()
future = asyncio.ensure_future(run(2))
loop.run_until_complete(future)
