from fastapi import APIRouter, Depends, FastAPI, Request
from pydantic import BaseModel
from typing_extensions import Annotated, List

from service.api.exceptions import ModelNotFoundError, UserNotFoundError
from service.log import app_logger

from ..models import Error
# from .auth import User, get_current_active_user
from .prompts import SYSTEM_DIVERSIFICATION_PROMT, SYSTEM_EXPLANATION_PROMT


class RecoResponse(BaseModel):
    wallet_address: str
    history: List[str]
    recommendations: List[str]
    diversification: List[str]
    reasoning: str


router = APIRouter()


@router.get(
    path="/health",
    tags=["Health"],
)
async def health() -> str:
    return "I am alive"


@router.get(
    path="/reco/{wallet_address}",
    tags=["Recommendations"],
    response_model=RecoResponse,
    responses={
        404: {"model": Error},
    },
)
async def get_reco(
    request: Request, wallet_address: str,
    # user: Annotated[User, Depends(get_current_active_user)]
) -> RecoResponse:
    app_logger.info(f"Request for wallet_address: {wallet_address}")
    history = request.app.state.history.get(str(wallet_address), [])
    recommendations = request.app.state.svd_recs.get(str(wallet_address))

    popular = False
    if not recommendations:
        recommendations = request.app.state.top_recs
        popular = True

    user_output = ', '.join(recommendations)
    if popular:
        diversification = request.app.state.classic_diversification
        reasoning = request.app.state.classic_reasoning
    else:
        diversification_response = request.app.state.client.chat.completions.create(
            model="Qwen/Qwen2.5-VL-7B-Instruct",
            messages=[
                {"role": "system", "content": SYSTEM_DIVERSIFICATION_PROMT},
                {"role": "user", "content": user_output},
            ],
        )
        diversification = diversification_response.choices[0].message.content
        reasoning_response = request.app.state.client.chat.completions.create(
            model="Qwen/Qwen2.5-VL-7B-Instruct",
            messages=[
                {"role": "system", "content": SYSTEM_EXPLANATION_PROMT},
                {"role": "user", "content": diversification},
            ],
        )
        reasoning = reasoning_response.choices[0].message.content
        diversification = diversification.split(', ')
    #    text = request.app.state.chatbot.generate_response(user_output)
    return RecoResponse(
        wallet_address=wallet_address,
        history=history,
        recommendations=recommendations,
        diversification=diversification,
        reasoning=reasoning
    )


def add_views(app: FastAPI) -> None:
    app.include_router(router)
