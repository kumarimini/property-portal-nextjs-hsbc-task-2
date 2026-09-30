from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.history import HistoryStore
from app.model_client import predict_price
from app.schemas import Estimate, HealthResponse, HouseFeatures

app = FastAPI(
    title="Property Value Estimator API",
    description="Validates property details, gets a price from the ML model, and keeps estimate history.",
    version="1.0.0",
)

# Allow the Next.js portal (a different origin) to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

history = HistoryStore()


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health():
    return {"status": "ok"}


@app.post("/estimates", response_model=Estimate, status_code=201, tags=["Estimates"])
async def create_estimate(house: HouseFeatures):
    """Validate the form data, get a prediction, save it to history."""
    price = await predict_price(house)
    return history.add(house, price)


@app.get("/estimates", response_model=list[Estimate], tags=["Estimates"])
def list_estimates():
    """Previous estimates, newest first."""
    return history.list()


@app.delete("/estimates", status_code=204, tags=["Estimates"])
def clear_estimates():
    """Clear the history."""
    history.clear()