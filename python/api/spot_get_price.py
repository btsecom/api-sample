#!/usr/bin/env python3

import requests
from requests.exceptions import HTTPError
from utils import get_env_info, get_spot_api_version, get_spot_full_url


def spot_get_price(data):
    url = "/api/{0}/price".format(get_spot_api_version())
    env = get_env_info()
    ret = {}
    try:
        resp = requests.get(
            get_spot_full_url(env["API_HOST"], url), params=data
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
    print(
        spot_get_price(
            {
                "symbol": "ETH-EUR",
            }
        )
    )
