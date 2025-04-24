import numpy as np
from datetime import datetime, timedelta, timezone
from fractal.loaders.binance import BinanceMinutePriceLoader


def get_token_price(token: str) -> np.float64:
    end_time = datetime.now(timezone.utc)
    start_time = end_time - timedelta(minutes=1)

    loader = BinanceMinutePriceLoader(
        ticker= token.upper() + "USDT",
        start_time=start_time,
        end_time=end_time,
    )
    print(loader.ticker)
    loader.run()
    history = loader.read()

    last_price = history["price"].iloc[-1]
    return last_price


### example
# token = "BNB"
# price = get_token_price(token)
# print(f"Цена {token}: {price} USDT")
