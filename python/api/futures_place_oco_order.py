#!/usr/bin/env python3

import json
import requests
from requests.exceptions import HTTPError
from utils import (
    get_env_info,
    get_futures_api_version,
    get_futures_full_url,
    gen_headers,
)


def futures_place_oco_order(data):
    url = "/api/{0}/order".format(get_futures_api_version())
    env = get_env_info()
    headers = gen_headers(
        env["API_KEY"], env["API_SECRET_KEY"], url, json.dumps(data)
    )
    ret = {}
    try:
        resp = requests.post(
            get_futures_full_url(env["API_HOST"], url),
            json=data,
            headers=headers,
        )
        resp.raise_for_status()
    except HTTPError as http_err:
        print("HTTP error occurred: {0}".format(http_err))
    except Exception as err:
        print("Other error occurred: {0}".format(err))
    finally:
        ret = resp
    return ret


if __name__ == "__main__":
    """
    BUY / Long
    The current BTCPERP price is 20200, I expect its price will downs less 20100 first and turn to ups over than 20400,
    so I set a "price" to be 20100, and I also set a "triggerPrice" to be 20400 and "stopPrice" to be 20401 at the same time.

    It will create 2 orders at the same time.
    The order will be completed when any of the below situations occur,
    and when any of the orders are completed, another order will be canceled.
    1. when the price is 20100.
    2. when the price ups directly without downs, it will trigger at price 20400 and attempt to buy at price 20401.
    """
    print(
        futures_place_oco_order(
            {
                "clOrderID": "test-order-placement",
                "size": 1,
                "price": "20100",
                "side": "BUY",
                "time_in_force": "GTC",
                "symbol": "BTCPERP",
                "triggerPrice": "20400",
                "stopPrice": "20401",
                "type": "OCO",
                "postOnly": false,
                "reduceOnly": false,
                "trigger": "markPrice",
            }
        )
    )
    """
    SELL / Short
    The current BTCPERP price is 20200, I expect its price will ups over 20400 first and turn to downs less than 20000,
    so I set a "price" to be 20400, and I also set a "triggerPrice" to be 20101 and "stopPrice" to be 20100 at the same time.

    It will create 2 orders at the same time.
    The order will be completed when any of the below situations occur,
    and when any of the orders are completed, another order will be canceled.
    1. when the price is 20400.
    2. when the price downs directly without ups, it will trigger at price 20101 and attempt to sell at price 20100.
    """
    print(
        futures_place_oco_order(
            {
                "clOrderID": "test-order-placement",
                "size": 1,
                "price": "20400",
                "side": "SELL",
                "time_in_force": "GTC",
                "symbol": "BTCPERP",
                "triggerPrice": "20101",
                "stopPrice": "20100",
                "type": "OCO",
                "postOnly": false,
                "reduceOnly": false,
                "trigger": "markPrice",
            }
        )
    )
