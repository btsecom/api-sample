#!/usr/bin/env python3

import json
import requests
from requests.exceptions import HTTPError
from utils import (
    get_env_info,
    get_spot_api_version,
    get_spot_full_url,
    gen_headers,
)


def spot_place_order(data):
    url = "/api/{0}/order".format(get_spot_api_version())
    env = get_env_info()
    headers = gen_headers(
        env["API_KEY"], env["API_SECRET_KEY"], url, json.dumps(data)
    )
    ret = {}
    try:
        resp = requests.post(
            get_spot_full_url(env["API_HOST"], url), json=data, headers=headers
        )
        resp.raise_for_status()
    except HTTPError as http_err:
        print("HTTP error occurred: {0}".format(http_err))
    except Exception as err:
        print("Other error occurred: {0}".format(err))
    finally:
        ret = resp.json()
    return ret


if __name__ == "__main__":
    # 4 kinds of data input
    market_order_data = {
        "symbol": "BTC-USD",
        "size": 0.0005,
        "side": "SELL",
        "type": "MARKET",
    }

    limit_order_data = {
        "symbol": "BTC-USD",
        "size": 0.0005,
        "price": 34000,
        "side": "BUY",
        "type": "LIMIT",
    }

    oco_order_data = {
        "symbol": "BTC-USD",
        "size": 0.0005,
        "price": 20300,
        "side": "BUY",
        "type": "OCO",
        "txType": "LIMIT",
        "stopPrice": 20300,
        "triggerPrice": 20309,
    }

    peg_order_data = {
        "symbol": "BTC-USD",
        "size": 0.0005,
        "price": 25000,
        "side": "BUY",
        "type": "PEG",
        "deviation": -10,
        "stealth": 10,
    }

    print(spot_place_order(market_order_data))
