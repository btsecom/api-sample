import ujson

BTSE_ENUM = {
1: "MARKET_UNAVAILABLE",
2: "ORDER_INSERTED",
4: "ORDER_FULLY_TRANSACTED",
5: "ORDER_PARTIALLY_TRANSACTED",
6: "ORDER_CANCELLED",
8: "INSUFFICIENT_BALANCE",
9: "TRIGGER_INSERTED",
10: "TRIGGER_ACTIVATED",
12: "ERROR_UPDATE_RISK_LIMIT",
28: "TRANSFER_UNSUCCESSFUL",
27: "TRANSFER_SUCCESSFUL",
41: "ERROR_INVALID_RISK_LIMIT",
64: "STATUS_LIQUIDATION",
101: "FUTURES_ORDER_PRICE_OUTSIDE_LIQUIDATION_PRICE",
1003: "ORDER_LIQUIDATION",
1004: "ORDER_ADL", 
404: "404 Error Cannot be Found"
}

def get_status_msg(code):
    msg = ''
    try:
        msg = BTSE_ENUM[code]
    except Exception as e:
        print(e)
    return msg 

# check if the string  is a json
def is_json(myjson):
    try:
        json_object = ujson.loads(myjson)
        if json_object:
            return True
    except ValueError:
        return False

def get_base(symbol):
    pairs = symbol.split('-')
    return pairs[0]

def get_quote(symbol):
    pairs = symbol.split('-')
    return pairs[1]


if __name__ == "__main__":
    
    response = {"status":2,"symbol":"BTC-USDT",
                "orderType":76,"price":7050.0,
                "side":"BUY","size":0.002,
                "orderID":"63763850-adca-43b6-a642-7912c7ddebaf",
                "timestamp":1603931889411,"triggerPrice":0.0,
                "stopPrice":'null',"trigger":'false',"message":""}
    
    code = response['status']
    
    msg = get_status_msg(code)
    print(f'Status message from code: {msg}')
    