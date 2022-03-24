#!/usr/bin/env python3

import websocket
import json
from utils import get_env_info, get_oss_spot_ws_url

MARKET = "BTC-USD"
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
        #
        # Please refer to our api spec for more details:
        # https://btsecom.github.io/docs/spot/en/#orderbook-incremental-updates
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

            # update orderbook with input data
            delta_asks_remove = dict(
                (x[0], x[1])
                for x in data["asks"]
                if len(x) == 2 and float(x[1]) == 0
            )
            delta_asks_upsert = dict(
                (x[0], x[1])
                for x in data["asks"]
                if len(x) == 2 and float(x[1]) != 0
            )
            delta_bids_remove = dict(
                (x[0], x[1])
                for x in data["bids"]
                if len(x) == 2 and float(x[1]) == 0
            )
            delta_bids_upsert = dict(
                (x[0], x[1])
                for x in data["bids"]
                if len(x) == 2 and float(x[1]) != 0
            )

            for k in delta_asks_remove.keys():
                ASKS.pop(k, None)
            for k, v in delta_asks_upsert.items():
                ASKS[k] = v

            for k in delta_bids_remove.keys():
                BIDS.pop(k, None)
            for k, v in delta_bids_upsert.items():
                BIDS[k] = v

            # validate cross orderbook and re-subscribe if needed
            sorted_asks = {k: ASKS[k] for k in sorted(ASKS, reverse=True)}
            sorted_bids = {k: BIDS[k] for k in sorted(BIDS, reverse=True)}
            if sorted_asks[-1] <= sorted_bids[0]:
                print("ERROR: cross orderbook, re-subscribe")
                _resubscribe(ws)
                return

            # output orderbook
            print(json.dumps(obj, indent=2))
            print(sorted_asks)
            print(sorted_bids)

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
        get_oss_spot_ws_url(env["WS_HOST"]),
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )
    ws.run_forever()
