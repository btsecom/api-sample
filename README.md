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

* 2022-09-14
  - Add examples to create oco futures order

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
