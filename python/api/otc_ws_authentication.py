#!/usr/bin/env python3

import websocket
import json
from utils import get_env_info, get_otc_ws_url, gen_headers

order_counts = {}


def on_message(ws, message):
    print(message)


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### socket closed ###")


def on_open(ws):
    # auth is mandatory in order to get your own positions

    url = "/ws/otc"
    headers = gen_headers(env["API_KEY"], env["API_SECRET_KEY"], url)
    print(headers)

    # enter your token
    your_token = ""
    payload = {"op": "token", "args": [your_token]}
    ws.send(json.dumps(payload))

    payload = {
        "op": "authKeyExpires",
        "args": [
            headers["request-api"],
            headers["request-nonce"],
            headers["request-sign"],
        ],
    }
    ws.send(json.dumps(payload))


if __name__ == "__main__":
    # websocket.enableTrace(True)
    env = get_env_info()
    ws = websocket.WebSocketApp(
        get_otc_ws_url(env["WS_HOST"]),
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )
    ws.run_forever()
