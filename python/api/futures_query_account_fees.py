#!/usr/bin/env python3

import requests
from requests.exceptions import HTTPError
from utils import (
    get_env_info,
    get_futures_api_version,
    get_spot_full_url,
    gen_headers,
)


def earn_get_ohlcv(data):
    url = "/api/{0}/user/fees".format(get_futures_api_version())
    env = get_env_info()
    headers = gen_headers(env["API_KEY"], env["API_SECRET_KEY"], url)
    params = data
    ret = {}
    try:
        resp = requests.get(
            get_spot_full_url(env["API_HOST"], url),
            params=params,
            headers=headers,
        )
        resp.raise_for_status()
    except HTTPError as http_err:
        print("HTTP error occurred: {0}".format(http_err))
    except Exception as err:
        print("Other error occurred: {0}".format(err))
    else:
        ret = resp.json()
    return ret


if __name__ == "__main__":
    data = {
        "makerFee": 0,
        "symbol": "BTCPFC",
        "takerFee": 0
    }
    print(earn_get_ohlcv(data))
