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
    1. `make run {{EXAMPLE_FILE}}` to run the example within docker container, for example: `make run api/examples/spot/spot_get_wallet_balance.py`


* [Nodejs](https://github.com/btsecom/api-sample/tree/master/nodejs)

  * How to play with node examples
    1. Run `cp config/.env.example nodejs/.env` and fill-in needed data in `.env`
    1. Set `nodejs` as your current working directory
    1. `make btse-api-nodejs` to build the runtime environment docker image
    1. `make run {{EXAMPLE_FILE}}` to run the example within docker container, for example: `make run src/examples/spot/get-wallet-balance.js`
