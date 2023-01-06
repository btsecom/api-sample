#!/usr/bin/env python3

import requests
from requests.exceptions import HTTPError
from utils import (
    gen_headers,
    get_env_info,
    get_spot_api_version,
    get_spot_full_url,
)


def queryWalletBalance(params):
    url = "/api/{0}/user/wallet".format(get_spot_api_version())
    env = get_env_info()
    headers = gen_headers(env["API_KEY"], env["API_SECRET_KEY"], url)
    ret = {}
    try:
        resp = requests.get(
            get_spot_full_url(env["API_HOST"], url),
            params=params,
            headers=headers,
        )
        print(get_spot_full_url(env["API_HOST"], url))
        resp.raise_for_status()
    except HTTPError as http_err:
        print("HTTP error occurred: {0}".format(http_err))
    except Exception as err:
        print("Other error occurred: {0}".format(err))
    finally:
        ret = resp.json()
    return ret


if __name__ == "__main__":
    data = {"available": 520.52, "currency": "USD", "total": 5566.5566}
    print(queryWalletBalance(data))
