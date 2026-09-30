from datetime import datetime

from pydantic import BaseModel, Field


class HouseFeatures(BaseModel):
    """The property details submitted by the form."""

    square_footage: float = Field(..., gt=0, examples=[1550])
    bedrooms: int = Field(..., ge=0, le=20, examples=[3])
    bathrooms: float = Field(..., ge=0, le=20, examples=[2])
    year_built: int = Field(..., ge=1800, le=2100, examples=[1997])
    lot_size: float = Field(..., gt=0, examples=[6800])
    distance_to_city_center: float = Field(..., ge=0, examples=[4.1])
    school_rating: float = Field(..., ge=0, le=10, examples=[7.6])


class Estimate(BaseModel):
    """One saved estimate: what was entered and what the model predicted."""

    id: int
    created_at: datetime
    inputs: HouseFeatures
    predicted_price: float


class HealthResponse(BaseModel):
    status: str