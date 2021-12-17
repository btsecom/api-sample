# BTSE API Connectors
Sample connectors for connecting to the BTSE API.

## Refer to the official API documentation located at:

* [Spot](https://btsecom.github.io/docs/spot/en/#change-log)
* [Futures](https://btsecom.github.io/docs/futures/en/#change-log)
* [OTC](https://btsecom.github.io/docs/otc/en/#change-log)
* [Streaming](https://btsecom.github.io/docs/streaming/en/#change-log)
* [Earn](https://btsecom.github.io/docs/earn/en/#change-log)

## Change Log

* 2021-12-27
  - Update Python and Nodejs examples

## Examples

  * API version
    - Spot: v3.2
    - Futures: v2.1
    - Otc: v1


* [Python](https://github.com/btsecom/api-sample/tree/master/python)

  * How to play with python examples
    1. Set `python` as your current working directory
    1. Run `cp .env.example .env` and fill-in needed data in `.env`
    1. Make sure [Python Poetry](https://python-poetry.org/docs/) is installed
    1. Install dependencies by `poetry install`
    1. Execute the sample by `poetry run api/streaming_otc.py`


* [Nodejs](https://github.com/btsecom/api-sample/tree/master/nodejs)

  * How to play with node examples
    1. Set `nodejs` as your current working directory
    1. Run `cp .env.example .env` and fill-in needed data in `.env`
    1. `make btse-api-nodejs` to build the runtime environment docker image
    1. `make run {{EXAMPLE_FILE}}` to run the example within docker container, for example: `make run src/examples/spot/get-wallet-information.js`
