#!/usr/bin/env python3

import collections
import websocket
import json
from utils import get_env_info, get_oss_futures_ws_url

MARKET = "LTCPFC"
GROUPING = 0
DELTA_SEQ_NUM = 0
BIDS = {}
ASKS = {}


def on_message(ws, message):
    global DELTA_SEQ_NUM
    global BIDS
    global ASKS
    try:
        # ***********************************************
        # [NOTE]
        #   1. Once connected to "update" topic, the first message passed back is a complete
        #      snapshot of the orderbook to append future delta updates to.
        #   2. Orders will be stores in `bids` and `asks` and each order is a (PRICE, SIZE) tuple.
        #   3. If the SIZE is zero then that price entry should be removed from the orderbook
        #   4. If the SIZE is not zero then should be added or replace existing entry of the same
        #      PRICE with the new SIZE
        #   5. Client should reconnect or (unsubscribe-then-re-subscribe) upon the following
        #      conditions:
        #        - Disconnect from server
        #        - Sequence number out of order
        #        - Cross orderbook (best-bid >= best-ask)
        # ***********************************************
        obj = json.loads(message)
        topic = obj.get("topic", "")
        data = obj.get("data", {})
        if topic.startswith("update") and data:
            # check if sequence number is continuous, re-subscribe if not
            if data["seqNum"] != data["prevSeqNum"] + 1:
                print("ERROR: sequence number is wrong, re-subscribe")
                _resubscribe(ws)
                return
            if DELTA_SEQ_NUM != 0 and data["seqNum"] != DELTA_SEQ_NUM + 1:
                print("ERROR: sequence number is not continuous, re-subscribe")
                _resubscribe(ws)
                return
            DELTA_SEQ_NUM = data["seqNum"]

            for ask in data["asks"]:
                price = float(ask[0])
                size = float(ask[1])
                if size == 0:
                    del ASKS[price]
                else:
                    ASKS[price] = size

            for bid in data["bids"]:
                price = float(bid[0])
                size = float(bid[1])
                if size == 0:
                    del BIDS[price]
                else:
                    BIDS[price] = size

            if len(ASKS.keys()) > 0 and len(BIDS.keys()) > 0:
                best_ask = sorted(ASKS.keys())[0]
                best_bid = sorted(BIDS.keys(), reverse=True)[0]
                print("best ask: " + str(best_ask))
                print("best bid: " + str(best_bid))
                if best_ask <= best_bid:
                    print("ERROR: crossed orderbook, re-subscribe")
                    _resubscribe(ws)
                    return

            # print out orderbook
            """
            print("obj")
            print(json.dumps(obj, indent=2))
            print()

            print("asks:")
            print(collections.OrderedDict(sorted(ASKS.items(), reverse=True)))
            print()
            print("bids:")
            print(collections.OrderedDict(sorted(BIDS.items(), reverse=True)))
            print()
            """

            asks = collections.OrderedDict(sorted(ASKS.items(), reverse=False))
            bids = collections.OrderedDict(sorted(BIDS.items(), reverse=True))
            symbol = obj["topic"]
            symbol = symbol.replace("update:", "")
            symbol = symbol.split("_", 1)
            symbol = symbol[0]
            orderbook = {
                "bids": [],
                "asks": [],
            }
            for key, value in bids.items():
                orderbook["bids"].append([key, value])
            for key, value in asks.items():
                orderbook["asks"].append([key, value])
            orderbook["symbol"] = symbol  # not the CCXT unified symbol
            orderbook["timestamp"] = data["timestamp"]
            orderbook["nonce"] = data["seqNum"]
            print("best ask: ", orderbook["asks"][0][0])
            print("best bid: ", orderbook["bids"][0][0])

    except Exception as e:
        print(e)


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### socket closed ###")


def on_open(ws):
    _subscribe(ws)


def _resubscribe(ws):
    global DELTA_SEQ_NUM
    global BIDS
    global ASKS

    _unsubscribe(ws)
    DELTA_SEQ_NUM = 0
    BIDS.clear()
    ASKS.clear()
    _subscribe(ws)


def _subscribe(ws):
    payload = {
        "op": "subscribe",
        "args": ["update:{0}_{1}".format(MARKET, GROUPING)],
    }
    print(payload)
    ws.send(json.dumps(payload))


def _unsubscribe(ws):
    payload = {
        "op": "unsubscribe",
        "args": ["update:{0}_{1}".format(MARKET, GROUPING)],
    }
    ws.send(json.dumps(payload))


if __name__ == "__main__":
    # websocket.enableTrace(True)
    env = get_env_info()
    ws = websocket.WebSocketApp(
        get_oss_futures_ws_url(env["WS_HOST"]),
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )
    ws.run_forever()
