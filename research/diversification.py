import os
from gigachat import GigaChat
from dotenv import load_dotenv
load_dotenv()

API_TOKEN = os.getenv("API_TOKEN")

def get_div(text: str) -> str:
    giga = GigaChat(
    credentials=API_TOKEN, #получить тут https://developers.sber.ru/studio/workspaces/
    verify_ssl_certs=False,
    )
    promt = f"""
        У тебя есть список из 25 рекомендаций формата:
        "chain_protocol_token_types"
        Пример: "arb_gmx_arb_GMX_common"

        Нужно выбрать 10 рекомендаций, чтобы они были максимально разнообразны по следующим признакам:

        Chain (разные блокчейны: eth, bsc, avax, op, arb, matic, и т.д.)

        Protocol (разные протоколы: aave2, gmx, lido, и т.д.)

        Token (разные активы)

        Types (если есть разные типы — например common, lending, и т.д.)

        Все 25 записей считаются релевантными. Необходимо выбрать 10 так, чтобы:

        они покрывали как можно больше разных цепочек и протоколов;

        в списке не было повторов по ключевым признакам;

        итоговый список всё ещё представлял интерес для пользователя.

        Верни отсортированный список из 10 рекомендаций (по степени приоритета), а также укажи кратко, как ты обеспечил разнообразие (например: "покрыты 7 разных блокчейнов, 9 протоколов и 10 токенов").

        Ответ верни в формате JSON с ключами: protocol, chain. Больше ничего объяснять не нужно, только JSON формат.

        Вот сами рекомендации:
        {text}
        """
    response = giga.chat(promt)
    
    return response.choices[0].message.content

### example
# text = """'lido_eth_ETH_common',
#  'arb_gmx_arb_GMX_common',
#  'arb_gmx_arb_WBTC/WETH/USDC/LINK/UNI/USDT/MIM/FRAX/DAI_common',
#  'arb_gmx_arb_esGMX_common',
#  'avax_wonderland_avax_TIME_common',
#  'aave2_eth_AAVE_common',
#  'bsc_pancakeswap_bsc_Cake_common',
#  'op_synthetix_op_SNX_lending',
#  'looksrare_eth_LOOKS_common',
#  'matic_quickswap_matic_QUICK_common'"""
# print(get_div(text))