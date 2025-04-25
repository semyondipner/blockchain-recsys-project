from fastapi import APIRouter, Depends, FastAPI, Request
from pydantic import BaseModel
from typing_extensions import Annotated, List

from service.api.exceptions import ModelNotFoundError, UserNotFoundError
from service.log import app_logger

from ..models import Error
# from .auth import User, get_current_active_user


class RecoResponse(BaseModel):
    user_id: str
    items: List[str]


router = APIRouter()


@router.get(
    path="/health",
    tags=["Health"],
)
async def health() -> str:
    return "I am alive"


@router.get(
    path="/reco/{model_name}/{user_id}",
    tags=["Recommendations"],
    response_model=RecoResponse,
    responses={
        404: {"model": Error},
    },
)
async def get_reco(
    request: Request, model_name: str, user_id: str,
    # user: Annotated[User, Depends(get_current_active_user)]
) -> RecoResponse:
    app_logger.info(f"Request for model: {model_name}, user_id: {user_id}")

    if model_name == "model":
        reco = request.app.state.svd_recs.get(str(user_id))
        if not reco:
            reco = request.app.state.top_recs
    else:
        raise ModelNotFoundError(error_message=f"Model {model_name} not found")

    return RecoResponse(user_id=user_id, items=reco)


def add_views(app: FastAPI) -> None:
    app.include_router(router)
