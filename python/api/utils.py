import os
import hashlib
import hmac
import time
from dotenv import load_dotenv


def get_env_info():
    """Load needed info from env file"""

    # API_KEY/API_SECRET/
    load_dotenv()
    api_key = os.getenv("API_KEY")
    api_secret_key = os.getenv("API_SECRET_KEY")
    api_host = os.getenv("API_HOST")
    ws_host = os.getenv("WS_HOST")

    assert api_key
    assert api_secret_key
    assert api_host
    assert ws_host

    env = {
        "API_KEY": api_key,
        "API_SECRET_KEY": api_secret_key,
        "API_HOST": api_host,
        "WS_HOST": ws_host,
    }

    return env


def get_spot_api_version():
    """Get spot api version"""
    return "v3.2"


def get_futures_api_version():
    """Get futures api version"""
    return "v2.1"


def get_otc_api_version():
    """Get otc api version"""
    return "v1"


def get_spot_full_url(host, path):
    """Get spot url based on host and path"""
    return "{0}/spot{1}".format(host, path)


def get_spot_ws_url(host):
    """Get spot ws url"""
    return "{0}/spot".format(host)


def get_futures_full_url(host, path):
    """Get futures url based on host and path"""
    return "{0}/futures{1}".format(host, path)


def get_futures_ws_url(host):
    """Get futures ws url"""
    return "{0}/futures".format(host)


def get_oss_spot_ws_url(host):
    """Get oss spot ws url"""
    return "{0}/oss/spot".format(host)


def get_oss_futures_ws_url(host):
    """Get oss futures ws url"""
    return "{0}/oss/futures".format(host)


def get_otc_full_url(host, path):
    """Get otc url based on host and path"""
    return "{0}/otc{1}".format(host, path)


def get_otc_ws_url(host):
    """Get otc ws url"""
    return "{0}/otc".format(host)


def gen_headers(api_key, api_paraphrase, path, data=""):
    """Generate header for authenticated enpoints

    Parameters
    ----------
    api_key: str
        api key
    api_paraphrase: str
        api secret
    path: str
        full api path
    data: str
        data payload
    """
    language = "latin-1"
    nonce = str(int(time.time() * 1000))
    message = path + nonce + data

    signature = hmac.new(
        bytes(api_paraphrase, language),
        msg=bytes(message, language),
        digestmod=hashlib.sha384,
    ).hexdigest()

    return {
        "request-api": api_key,
        "request-nonce": nonce,
        "request-sign": signature,
        "Accept": "application/json;charset=UTF-8",
        "Content-Type": "application/json",
    }
