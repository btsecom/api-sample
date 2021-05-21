# BTSE API Connectors
Sample connectors for connecting to the BTSE API.

Refer to the official API documentation located at: 
* [Futures](https://www.btse.com/apiexplorer/futures)
* [Spot](https://www.btse.com/apiexplorer/spot)

Examples
* [Python](https://github.com/btsecom/api-sample/tree/master/python)
* [Nodejs](https://github.com/btsecom/api-sample/tree/master/nodejs)

    * API version

        * Spot: v3.2
        * Futures: v2.1

    * How to playing with examples

        1. Set `nodejs` as your current working directory
        1. Run `cp .env.example .env` and fill-in needed data in `.env`
        1. `make btse-api-nodejs` to build the runtime environment docker image
        1. `make run {{EXAMPLE_FILE}}` to run the example within docker container, for example: `make run src/examples/spot/get-wallet-information.js`
