#!/usr/bin/env python3

import websocket
import json
from utils import get_env_info, get_otc_ws_url, gen_headers

order_counts = {}


def on_message(ws, message):
    print(message)

    # unsubscribe a specific quote
    obj = json.loads(message)
    clOrderId = obj.get("clOrderId", None)
    if clOrderId and clOrderId == "order1":
        _unsubscribe_topic(ws, "BTC-USD", 1, "BTC", "order1")
    if not clOrderId or clOrderId == "order1":
        return

    # unsubscribe all if all exceed the threshold
    count = order_counts.get(clOrderId, 0)
    order_counts[clOrderId] = count + 1

    all_over_threshold = True
    for _, v in order_counts.items():
        if v < 10:
            all_over_threshold = False
            break

    if all_over_threshold:
        _unsubscribe_all(ws)
        print("Unsubscribe all quotes.")


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### socket closed ###")


def on_open(ws):
    # OPTIONAL: login with auth to get quote
    url = "/ws/otc"
    headers = gen_headers(env["API_KEY"], env["API_SECRET_KEY"], url)
    payload = {
        "op": "authKeyExpires",
        "args": [
            headers["request-api"],
            headers["request-nonce"],
            headers["request-sign"],
        ],
    }
    print(payload)
    ws.send(json.dumps(payload))

    # subscribe to otc streaming quote
    _subscribe_topic(ws, "BTC-USD", 0.1, "BTC", "order1")
    _subscribe_topic(ws, "BTC-USD", 2, "BTC", "order2")
    _subscribe_topic(ws, "BTC-USD", 10, "BTC", "order3")


def _op_topic(ws, op, symbol, quantity, currency, clOrderId=""):
    payload = {
        "op": op,
        "symbol": symbol,
        "clOrderId": clOrderId,
        "quantity": {
            "quantity": quantity,
            "currency": currency,
        },
    }
    ws.send(json.dumps(payload))


def _subscribe_topic(ws, symbol, quantity, currency, clOrderId=""):
    _op_topic(ws, "quote", symbol, quantity, currency, clOrderId)


def _unsubscribe_topic(ws, symbol, quantity, currency, clOrderId):
    _op_topic(ws, "unsubscribe-quote", symbol, quantity, currency, clOrderId)


def _unsubscribe_all(ws):
    payload = {
        "op": "unsubscribe-quote-all",
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
