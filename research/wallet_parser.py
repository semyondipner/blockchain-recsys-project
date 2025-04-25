from moralis import evm_api #api take from https://admin.moralis.com/login

def get_tokens_from_wallet(wallet, chain_id, API) -> str:
    params = {
    "chain": chain_id,
    "address": wallet,
    "exclude_native": False,
    "exclude_spam": True,
    "limit": 100,
    }
    response = evm_api.wallets.get_wallet_token_balances_price(
    api_key=API,
    params=params,
    )
    filtered_tokens = [token for token in response["result"] if token["usd_value"] > 0.1] #only usable tokens
    # total_portfolio_percentage = sum(token["portfolio_percentage"] for token in filtered_tokens)
    result_string = " ".join(token["symbol"] for token in filtered_tokens)
    return result_string


### example
# api_key = "."
# chain = 'eth'
# wallet = '0xac207c599e4a07f9a8cc5e9cf49b02e20ab7ba69'
# res = get_tokens_from_wallet(wallet, chain, api_key)
# print(res)