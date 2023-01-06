#!/usr/bin/env python3

import websocket
import json
from utils import get_env_info, get_futures_ws_url

order_counts = {}


def on_message(ws, message):
    print(message)


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### socket closed ###")


def login(ws, your_token):
    payload = {"op": "token", "args": [your_token]}
    ws.send(json.dumps(payload))


def on_open(ws):
    your_token = ""  # enter your token here
    login(ws, your_token)

    payload = {
        "op": "subscribe",
        "args": ["orderBookL2Api:BTCPFC_0"],
    }
    ws.send(json.dumps(payload))


if __name__ == "__main__":
    # websocket.enableTrace(True)
    env = get_env_info()
    ws = websocket.WebSocketApp(
        get_futures_ws_url(env["WS_HOST"]),
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )
    ws.run_forever()
