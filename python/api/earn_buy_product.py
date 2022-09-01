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


def earn_buy_product(data):
    url = "/api/{0}/invest/deposit".format(get_spot_api_version())
    env = get_env_info()
    headers = gen_headers(
        env["API_KEY"], env["API_SECRET_KEY"], url, json.dumps(data)
    )
    ret = {}
    try:
        resp = requests.post(
            get_spot_full_url(env["API_HOST"], url),
            json=data,
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
    print(
        earn_buy_product(
            {
                "productId": "LENDWGBP000001",
                "amount": 1,
                "renew": False,
                "rate": 77.224,
                "day": 30,
            }
        )
    )
