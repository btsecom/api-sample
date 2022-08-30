#!/usr/bin/env python3

import requests
from requests.exceptions import HTTPError
from utils import get_env_info, get_futures_api_version, get_futures_full_url


def query_market_price(params):
    url = "/api/{0}/price".format(get_futures_api_version())
    env = get_env_info()
    ret = {}
    try:
        resp = requests.get(
            get_futures_full_url(env["API_HOST"], url), params=params
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
        "symbol": 'BTC-USD'
    }
    print(query_market_price(data))
