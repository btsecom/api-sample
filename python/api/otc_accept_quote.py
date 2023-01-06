#!/usr/bin/env python3

import sys
import json
import requests
import otc_get_quote
from requests.exceptions import HTTPError
from utils import (
    get_env_info,
    get_otc_api_version,
    get_otc_full_url,
    gen_headers,
)


def otc_accept_quote(quote_id):
    url = "/api/{0}/accept/{1}".format(get_otc_api_version(), quote_id)
    env = get_env_info()
    headers = gen_headers(env["API_KEY"], env["API_SECRET_KEY"], url)
    ret = {}
    try:
        resp = requests.post(
            get_otc_full_url(env["API_HOST"], url), headers=headers
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
    otc_order = otc_get_quote.otc_get_quote(
        {
            "baseCurrency": "BTC",
            "orderCurrency": "USD",
            "side": "buy",
            "orderAmountInOrderCurrency": 1,
        }
    )
    if not otc_order:
        print("ERROR: failed to get otc order!")
        sys.exit(0)
    status = otc_order.get("status", None)
    quote_id = otc_order.get("quoteId", None)

    if not status or status != 30001 or not quote_id:
        print("ERROR: otc info error!")
        sys.exit(0)

    print(otc_order)

    print("Accepting order: {0}".format(quote_id))
    otc_order_result = otc_accept_quote(quote_id)

    if not otc_order_result:
        print("ERROR: failed to get accept otc order info!")
        sys.exit(0)

    order_status = otc_order_result.get("status", None)

    # 30007 is 'OTC_ORDER_COMPLETE_SUCCESS'
    if not order_status or order_status != 30007:
        print("ERROR: failed to accept otc order!")
        sys.exit(0)

    print("OTC order: {0} accepted successfully.".format(quote_id))
