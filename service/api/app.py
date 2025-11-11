import os

import json
import asyncio
from concurrent.futures.thread import ThreadPoolExecutor
from typing import Any, Dict

import uvloop
from fastapi import FastAPI

from ..log import app_logger, setup_logging
from ..settings import ServiceConfig
from .auth import add_auth
from .exception_handlers import add_exception_handlers
from .middlewares import add_middlewares
from .views import add_views

from openai import OpenAI
# from .qwen import QwenChatbot

PATH = "/Users/semyondipner/Desktop/GitHub/ITMOProjects/Blockchain/blockchain-recsys-project/"

CLASSIC_REASONING = """
1. **Lido (lido_eth_ETH_common)**
— ETH staking with a stable return (~0.044 ETH per year per 1 ETH) and low risk, making it attractive to conservative investors.

2. **Aave (aave2_eth_AAVE_common)**
— AAVE staking provides 6-7% per annum, but is associated with liquidity risks in the event of loan defaults.

3. **Convex (convex_eth_cvxCRV_common)**
— Yield optimization for stablecoin pools on Curve with additional rewards in CVX. Highly efficient compared to competitors.

4. **GMX (arb_gmx_arb_GMX_common)**
— High liquidity and profitability through trading on Arbitrum. ARB rewards program (12 million tokens) enhances attractiveness for liquidity providers.

5. Curve (curve_eth_DAI/USDC/USDT_common)**
— A leader among stablecoin pools with robust returns supported by deep liquidity and optimization via Convex.

6. Radiant Capital (arb_radiantcapital2_arb_RDNT/WETH_locked)**
— A multi-chain lending protocol with potentially high returns from cross-chain asset resale.

7. Rocket Pool (rocketpool_eth_ETH_common)**
— A decentralized ETH staking solution competing with Lido. Validator rewards and robust demand for rETH.
8. **Camelot (arb_camelot_arb_GRAIL_common)**
— An Arbitrum DEX with growing TVL and potential for GRAIL price appreciation thanks to active ecosystem development.
9. **GMX (avax_gmx_avax_AVAX/WBTC.e/WETH.e/MIM/USDC.e/USDC/BTC.b_common)**
— An expansion of GMX on Avalanche with a similar yield model to Arbitrum, but with less competition.
10. **SyncSwap (era_syncswap_era_USDC/ETH_common)**
— A promising DEX on ZKsync Era with growth potential due to low market saturation and scalability integration.

**Diversification**:
- **Blockchains**: Ethereum, Arbitrum, Avalanche, ZKsync.
- **Categories**: Staking (Lido, Rocket Pool), DEX (GMX, Camelot, Curve), Lending (Aave, Radiant), Liquidity Optimization (Convex).

**Risks**:
- High-yield protocols (e.g., GMX, Camelot) are subject to market fluctuations.
- Aave and Convex require consideration of liquidity and default risks.
"""

__all__ = ("create_app",)

def read_json(path: str) -> Dict:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def setup_asyncio(thread_name_prefix: str) -> None:
    asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    executor = ThreadPoolExecutor(thread_name_prefix=thread_name_prefix)
    loop.set_default_executor(executor)

    def handler(_, context: Dict[str, Any]) -> None:
        message = "Caught asyncio exception: {message}".format_map(context)
        app_logger.warning(message)

    loop.set_exception_handler(handler)


def create_app(config: ServiceConfig) -> FastAPI:
    setup_logging(config)
    setup_asyncio(thread_name_prefix=config.service_name)

    app = FastAPI(debug=False)

    # Top Recs
    app.state.k_recs = config.k_recs
    # app.state.chatbot = QwenChatbot()
    print(os.getenv("OPENAI_API_TOKEN"))
    print(os.getenv("OPANAI_API_BASE"))
    app.state.client = OpenAI(
        api_key=os.getenv("OPENAI_API_TOKEN"),
        base_url=os.getenv("OPANAI_API_BASE")
    )
    app.state.history = read_json(PATH + 'data/user_history.json')
    app.state.svd_recs = read_json(PATH + 'data/svd_recos.json')
    app.state.top_recs = [
        'lido_eth_ETH_common',
        'arb_gmx_arb_GMX_common',
        'arb_gmx_arb_WBTC/WETH/USDC/LINK/UNI/USDT/MIM/FRAX/DAI_common',
        'arb_gmx_arb_esGMX_common',
        'avax_wonderland_avax_TIME_common',
        'aave2_eth_AAVE_common',
        'bsc_pancakeswap_bsc_Cake_common',
        'op_synthetix_op_SNX_lending',
        'looksrare_eth_LOOKS_common',
        'matic_quickswap_matic_QUICK_common',
        'convex_eth_cvxCRV_common',
        'curve_eth_DAI/USDC/USDT_common',
        'blur_eth_ETH_common',
        'curve_eth_CRV_locked',
        'arb_camelot_arb_GRAIL_common',
        'ftm_geist_ftm_GEIST_common',
        'era_syncswap_era_USDC/ETH_common',
        'bsc_mdex_bsc_MDX_common',
        'arb_arbitrum_arb_ARB_common',
        'bsc_belt_bsc_DAI/USDC/USDT/BUSD_common',
        'matic_klimadao_matic_KLIMA_common',
        'olympusdao_eth_OHM_common',
        'arb_radiantcapital2_arb_RDNT/WETH_locked',
        'avax_gmx_avax_AVAX/WBTC.e/WETH.e/MIM/USDC.e/USDC/BTC.b_common',
        'rocketpool_eth_ETH_common'
    ]
    app.state.classic_diversification = [
        "lido_eth_ETH_common",
        "aave2_eth_AAVE_common",
        "convex_eth_cvxCRV_common",
        "arb_gmx_arb_GMX_common",
        "curve_eth_DAI/USDC/USDT_common",
        "arb_radiantcapital2_arb_RDNT/WETH_locked",
        "lido_eth_ETH_common",
        "arb_camelot_arb_GRAIL_common",
        "avax_gmx_avax_AVAX/WBTC.e/WETH.e/MIM/USDC.e/USDC/BTC.b_common",
        "era_syncswap_era_USDC/ETH_common"
    ]
    app.state.classic_reasoning = CLASSIC_REASONING

    add_auth(app)
    add_views(app)
    add_middlewares(app)
    add_exception_handlers(app)

    return app


# top_recs = [
#         'lido_eth_ETH_common',
#         'arb_gmx_arb_GMX_common',
#         'arb_gmx_arb_WBTC/WETH/USDC/LINK/UNI/USDT/MIM/FRAX/DAI_common',
#         'arb_gmx_arb_esGMX_common',
#         'avax_wonderland_avax_TIME_common',
#         'aave2_eth_AAVE_common',
#         'bsc_pancakeswap_bsc_Cake_common',
#         'op_synthetix_op_SNX_lending',
#         'looksrare_eth_LOOKS_common',
#         'matic_quickswap_matic_QUICK_common',
#         'convex_eth_cvxCRV_common',
#         'curve_eth_DAI/USDC/USDT_common',
#         'blur_eth_ETH_common',
#         'curve_eth_CRV_locked',
#         'arb_camelot_arb_GRAIL_common',
#         'ftm_geist_ftm_GEIST_common',
#         'era_syncswap_era_USDC/ETH_common',
#         'bsc_mdex_bsc_MDX_common',
#         'arb_arbitrum_arb_ARB_common',
#         'bsc_belt_bsc_DAI/USDC/USDT/BUSD_common',
#         'matic_klimadao_matic_KLIMA_common',
#         'olympusdao_eth_OHM_common',
#         'arb_radiantcapital2_arb_RDNT/WETH_locked',
#         'avax_gmx_avax_AVAX/WBTC.e/WETH.e/MIM/USDC.e/USDC/BTC.b_common',
#         'rocketpool_eth_ETH_common'
#     ]

# top_recs = ', '.join(top_recs)

# OPENAI_API_TOKEN="d+ICFwNbI4e8YPw2cycwHPBsH3YX9+yH82pTdWa4X/Q="
# OPANAI_API_BASE="http://69.30.85.131:22011/v1/"

# client = OpenAI(
#     api_key=OPENAI_API_TOKEN,
#     base_url=OPANAI_API_BASE
# )

# diversification_response = client.chat.completions.create(
#     model="Qwen/Qwen2.5-VL-7B-Instruct",
#     messages=[
#         {"role": "system", "content": SYSTEM_DIVERSIFICATION_PROMT},
#         {"role": "user", "content": top_recs},
#     ],
# )
# diversification_recs = diversification_response.choices[0].message.content
# explanation_response = client.chat.completions.create(
#     model="Qwen/Qwen2.5-VL-7B-Instruct",
#     messages=[
#         {"role": "system", "content": SYSTEM_EXPLANATION_PROMT},
#         {"role": "user", "content": diversification_recs},
#     ],
# )
# print(explanation_response.choices[0].message.content)