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


def spot_place_limit_order(data):
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


def spot_cancel_order(params):
    url = "/api/{0}/order".format(get_spot_api_version())
    env = get_env_info()
    headers = gen_headers(env["API_KEY"], env["API_SECRET_KEY"], url)
    ret = {}
    try:
        resp = requests.delete(
            get_spot_full_url(env["API_HOST"], url),
            params=params,
            headers=headers,
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
    # place order 1
    print(
        spot_place_limit_order(
            {
                "clOrderID": "test-order-1",
                "size": 0.00002,
                "price": 10,
                "side": "BUY",
                "symbol": "BTC-USD",
                "time_in_force": "GTC",
                "txType": "LIMIT",
                "type": "LIMIT",
            }
        )
    )

    # place order 2
    print(
        spot_place_limit_order(
            {
                "clOrderID": "test-order-2",
                "size": 0.00003,
                "price": 5,
                "side": "BUY",
                "symbol": "BTC-USD",
                "time_in_force": "GTC",
                "txType": "LIMIT",
                "type": "LIMIT",
            }
        )
    )

    # cancel all orders
    print(
        spot_cancel_order(
            {
                "symbol": "BTC-USD",
            }
        )
    )
