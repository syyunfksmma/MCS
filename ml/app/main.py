from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(
    title="MCMS ML Stub",
    version="0.1.0",
    description="Placeholder FastAPI service for MCMS PoC without external SaaS dependencies."
)


class PredictRequest(BaseModel):
    routing_id: str
    revision_id: str
    feature_vector: dict | None = None


class PredictResponse(BaseModel):
    routing_id: str
    revision_id: str
    decision: str
    reason: str
    generated_at: datetime


@app.get("/health", response_model=dict)
def health() -> dict:
    return {"status": "ok", "service": "ml-stub", "timestamp": datetime.utcnow()}


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    if not request.routing_id:
        raise HTTPException(status_code=400, detail="routing_id is required")

    return PredictResponse(
        routing_id=request.routing_id,
        revision_id=request.revision_id,
        decision="not_applicable",
        reason="Legacy ML workflow deprecated; FastAPI service retained for contract compatibility.",
        generated_at=datetime.utcnow()
    )
