#!/usr/bin/env python3

import websocket
import json
import requests
from requests.exceptions import HTTPError
from utils import (
    get_env_info,
    get_spot_ws_url,
    get_spot_api_version,
    get_spot_full_url,
    gen_headers,
)


clOrderID = "test-order-placement"


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
    else:
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
    else:
        ret = resp.json()
    return ret


def on_message(ws, message):
    payload = json.loads(message)
    print(json.dumps(payload, indent=2))

    if payload["data"] and payload["data"]["clOrderID"] == clOrderID:
        status = payload["data"]["status"]
        # 2: ORDER_INSERTED = Order is inserted successfully
        if status == 2:
            print("Order is inserted successfully")
            spot_cancel_order(
                {
                    "symbol": "BTC-USD",
                    "clOrderID": clOrderID,
                }
            )
        # 4: ORDER_FULLY_TRANSACTED = Order is fully transacted
        elif status == 4:
            print("Order is fully transacted")
        # 5: ORDER_PARTIALLY_TRANSACTED = Order is partially transacted
        elif status == 5:
            print("Order is partially transacted")
        # 6: ORDER_CANCELLED = Order is cancelled successfully
        # 15: ORDER_REJECTED = Order is rejected
        elif status == 6 or status == 15:
            print("Order is cancelled successfully")


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### socket closed ###")


def on_open(ws):
    url = "/ws/spot"
    headers = gen_headers(env["API_KEY"], env["API_SECRET_KEY"], url)
    ws.send(
        json.dumps(
            {
                "op": "authKeyExpires",
                "args": [
                    headers["request-api"],
                    headers["request-nonce"],
                    headers["request-sign"],
                ],
            }
        )
    )
    ws.send(
        json.dumps(
            {
                "op": "subscribe",
                "args": ["notificationApiV2"],
            }
        )
    )
    spot_place_limit_order(
        {
            "clOrderID": clOrderID,
            "size": 0.0002,
            "price": 10,
            "side": "BUY",
            "symbol": "BTC-USD",
            "time_in_force": "GTC",
            "txType": "LIMIT",
            "type": "LIMIT",
        }
    )


if __name__ == "__main__":
    # websocket.enableTrace(True)
    env = get_env_info()
    ws = websocket.WebSocketApp(
        get_spot_ws_url(env["WS_HOST"]),
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )
    ws.run_forever()
