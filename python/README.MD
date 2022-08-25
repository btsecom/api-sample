few things to begin with
testnet secret key, signature key
download docker(You aren't runnable if you run on windows locally)


add .env to python folder with following code
```
API_HOST=https://api.btse.com
API_KEY=YOUR_TESTNET_API_KEY
API_SECRET_KEY=YOUR_TESTNET_SECRET_KEY
WS_HOST=wss://ws.btse.com/ws
```

DOCKER
check your python ios version(should be linux, but be more specific)
download the speicifc versino for each package for poetry, sudo, dos2unix
1. convert all .py files to unix by ```find . -type f -print0 | xargs -0 dos2unix```
2. ```poetry run /app/filename```

POSTMAN
address prefix:https://www.btse.dev/api/spot/api/