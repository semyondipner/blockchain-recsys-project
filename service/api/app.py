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


PATH = "/Users/semyondipner/Desktop/GitHub/ITMOProjects/Blockchain/blockchain-recsys-project/"

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

    add_auth(app)
    add_views(app)
    add_middlewares(app)
    add_exception_handlers(app)

    return app
