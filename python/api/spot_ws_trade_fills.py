#!/usr/bin/env python3

import websocket
import json
from spot_post_place_order import spot_place_order
from utils import (
    get_env_info,
    get_spot_ws_url,
    gen_headers,
)

clOrderID = "test-order-placement"


def on_message(ws, message):
    payload = json.loads(message)
    print(json.dumps(payload, indent=2))


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
                "args": ["fills"],
            }
        )
    )

    spot_place_order(
        {"symbol": "BTC-USD", "size": 0.0005, "side": "BUY", "type": "MARKET"}
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
