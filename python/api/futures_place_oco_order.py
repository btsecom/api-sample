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
    else:
        ret = resp
    return ret


if __name__ == "__main__":
    print(
        futures_place_oco_order(
            {
                "clOrderID": "test-order-placement",
                "size": 1,
                "price": "20200",
                "side": "BUY",
                "symbol": "BTCPFC",
                "time_in_force": "GTC",
                "type": "OCO",
                "postOnly": false,
                "reduceOnly": false,
                "stopPrice": "20401",
                "triggerPrice": "20400",
                "trigger": "markPrice",
            }
        )
    )
