# BTSE API Connectors
Sample connectors for connecting to the BTSE API.

## Refer to the official API documentation located at:

* [Spot](https://btsecom.github.io/docs/spot/en/#change-log)
* [Futures](https://btsecom.github.io/docs/futures/en/#change-log)
* [OTC](https://btsecom.github.io/docs/otc/en/#change-log)
* [Wallet/Convert/Transfer](https://btsecom.github.io/docs/wallet/en/#change-log)
* [Streaming](https://btsecom.github.io/docs/streaming/en/#change-log)
* [Earn](https://btsecom.github.io/docs/earn/en/#change-log)

## Change Log

* 2022-08-19
  - Add examples to get order status via notification v2 websocket topic

* 2022-06-28
  - Add examples to query futures trade history

* 2022-04-09
  - Add python example to delete multiple orders

* 2022-03-30
  - Add nodejs sample to get all futures position via `allPosition` websocket topic

* 2022-03-24
  - Add python and js samples for oss delta orderbook
    - `nodejs -> app -> spot -> ws-oss-delta.js`
    - `nodejs -> app -> spot -> ws-oss-snapshot.js`
    - `python -> api -> spot_ws_get_oss_delta.py`
    - `python -> api -> spot_ws_get_oss_snapshot.py`

* 2022-02-18
  - Add more examples for `amend order` and others

* 2022-02-02
  - Futures settle_in sample to change settlement currency

* 2022-01-25
  - Add nodejs example for `fetch wallet convert rate` and `otc partial transact`

* 2022-01-18
  - Add python docker environment and adjust file structure

* 2022-01-13
  - Add examples for wallet convert and transfer

* 2022-01-10
  - Update Nodejs orderbook delta examples

* 2021-12-27
  - Update Python and Nodejs examples

## Examples

  * API version
    - Spot: v3.2
    - Futures: v2.1
    - Otc: v1


* [Python](https://github.com/btsecom/api-sample/tree/master/python)

  * How to play with python examples
    1. Run `cp config/.env.example python/.env` and fill-in needed data in `.env`
    1. Set `python` as your current working directory
    1. `make btse-api-python` to build the runtime environment docker image
    1. `make run {{EXAMPLE_FILE}}` to run the example within docker container, for example: `make run api/spot_get_wallet_balance.py`


* [Nodejs](https://github.com/btsecom/api-sample/tree/master/nodejs)

  * How to play with node examples
    1. Run `cp config/.env.example nodejs/.env` and fill-in needed data in `.env`
    1. Set `nodejs` as your current working directory
    1. `make btse-api-nodejs` to build the runtime environment docker image
    1. `make run {{EXAMPLE_FILE}}` to run the example within docker container, for example: `make run app/spot/query-market-summary.js`



# Files Comparison
## Earn
### Investment Endpoints
|Document Name |Python |
| :--------   | :--------   |
|Deposit Investment |earn_buy_product.py |
|Query Investment History |earn_get_history.py |
|Query Investment Orders |earn_get_orders.py |
|Query Investment Products |earn_get_products.py |
|Redeem Investment |earn_redeem_product.py |
|Renew Investment |earn_renew_product.py |
<br>

## Futures
### Public Endpoints
|Document Name |Python | 
| :--------   | :--------   | 
|Market Summary |futures_get_market_summary.py | 
|Charting Data |futures_charting_data.py | 
|Query Market price | futures_query_market_price.py | 
|Orderbook (By grouping) |futures_get_orderbook.py | 
|Orderbook |futures_get_orderbook_L2.py | 
|Query Trades Fills |futures_get_trades.py | 

### Trade Endpoints
|Document Name |Python | 
| :--------   | :--------   | 
|Create new order |futures_place_limit_order.py | 
|Create new algo order|futures_create_new_algo_order.py|
|Amend Order |futures_amend_order.py |
|Cancel Order |futures_cancel_order.py | 
|Dead man's switch (Cancel all after)|futures_cancel_all_after.py|
|Query Open Orders |futures_get_open_orders.py |
|Query Trades Fills|futures_query_trades_fills.py|
|Query Position|futures_query_position.py|query-positions.js|
|Close Position|futures_close_position.py|
|Set Risk Limits|futures_set_risk_limits.py|
|Set Leverage|futures_set_leverage.py|
|Change contract settlement currency|futures_change_settlement_currency.py | 
|Query Account Fees|futures_query_account_fees.py|

### Wallet Endpoints
|Document Name |Python | 
| :--------   | :--------   | 
|Query Wallet Balance|futures_query_wallet_balance.py|
|Query Wallet History | futures_query_wallet_history.py | 
|Query Wallet Margin|futures_query_wallet_margin.py|
|Transfer funds between Futures wallet|futures_transfer_funds_between_futures_wallet.py|

### Websocket Streams
|Document Name |Python |
| :--------   | :--------   |
|Subscription|futures_ws_subscription.py |
|Orderbook Snapshot (By grouping)|futures_ws_get_orderbook_group.py |
|Orderbook Snapshot (By depth)|futures_ws_get_orderbook_depth.py|
|Orderbook Incremental Updates|futures_ws_get_oss_delta.py|
|Public Trade Fills|futures_ws_public_trade_fills.py|
|Authentication|futures_ws_authentication.py|
|Notifications|futures_ws_notifcations.py|
|User Trade Fills|futures_ws_user_trade_fillls.py|
|All Position|futures_ws_get_all_position.py|

## OTC
### OTC Endpoints
|Document Name |Python |
| :--------   | :--------   |
|Market Summary|otc_get_market_summary.py|
|Request for Quote|otc_get_quote.py|
|Accept Quote|otc_accept_quote.py|
|Query Order||

### Websocket Streams
|Document Name |Python |
| :--------   | :--------   |
|Authentication|otc_ws_authentication.py|
|Quote Stream|otc_ws_quote_stream.py|

## Streaming
### Workflow
|Document Name |Python |
| :--------   | :--------   |
|Streaming OTC|streaming_otc.py|

### Websocket Streams
|Document Name |Python |
| :--------   | :--------   |
|Authentication|otc_ws_authentication.py|
|Quote Stream|otc_ws_quote_stream.py|

## wallet/Convert/Transfer
### Public Endpoints
|Document Name |Python |
| :--------   | :--------   |
|Query available crypto network list for currency|queryAvailableCrypo.py|
|Query exchange rate between assets|queryExchangeRate.py|

### Wallet Endpoints
|Document Name |Python |
| :--------   | :--------   |
|Query Wallet Balance|queryWalletBalance.py|
|Query Wallet History|WalletqueryWalletHistory.py|
|Query available currency list for wallet action|queryAvailableCurrency.py|
|Convert funds||
|Transfer funds||