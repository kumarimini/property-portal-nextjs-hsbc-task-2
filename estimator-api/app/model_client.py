import os

import httpx
from fastapi import HTTPException

from app.schemas import HouseFeatures

MODEL_API_URL = os.getenv("MODEL_API_URL", "http://localhost:8000")


async def predict_price(house: HouseFeatures) -> float:
    """Ask the Task 1 model container for a price and handle failures."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                f"{MODEL_API_URL}/predict", json=house.model_dump()
            )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="The prediction service took too long to respond.",
        )
    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="The prediction service is unavailable. Is the model container running?",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502, detail="The prediction service returned an error."
        )

    try:
        return float(response.json()["predictions"][0])
    except (ValueError, KeyError, IndexError):
        raise HTTPException(
            status_code=502, detail="The prediction service sent an unexpected response."
        )