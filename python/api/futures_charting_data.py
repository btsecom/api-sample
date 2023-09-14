#!/usr/bin/env python3

import requests
from requests.exceptions import HTTPError
from utils import (
    get_env_info,
    get_futures_api_version,
    get_futures_full_url,
    gen_headers,
)


def earn_get_ohlcv(data):
    url = "/api/{0}/ohlcv".format(get_futures_api_version())
    env = get_env_info()
    headers = gen_headers(env["API_KEY"], env["API_SECRET_KEY"], url)
    params = data
    ret = {}
    try:
        # page_number is 1-based
        resp = requests.get(
            get_futures_full_url(env["API_HOST"], url),
            params=params,
            headers=headers,
        )
        print(get_futures_full_url(env["API_HOST"], url))
        resp.raise_for_status()
    except HTTPError as http_err:
        print("HTTP error occurred: {0}".format(http_err))
    except Exception as err:
        print("Other error occurred: {0}".format(err))
    finally:
        ret = resp.json()
    return ret


if __name__ == "__main__":
    data = {
        "symbol": "BTCPERP",
    }
    print(earn_get_ohlcv(data))
