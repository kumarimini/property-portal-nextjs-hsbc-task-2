from datetime import datetime, timezone
from threading import Lock

from app.schemas import Estimate, HouseFeatures

MAX_ITEMS = 100


class HistoryStore:
    """Keeps previous estimates in memory."""

    def __init__(self) -> None:
        self._items: list[Estimate] = []
        self._next_id = 1
        self._lock = Lock()

    def add(self, inputs: HouseFeatures, predicted_price: float) -> Estimate:
        with self._lock:
            estimate = Estimate(
                id=self._next_id,
                created_at=datetime.now(timezone.utc),
                inputs=inputs,
                predicted_price=predicted_price,
            )
            self._next_id += 1
            self._items.append(estimate)
            self._items = self._items[-MAX_ITEMS:]
            return estimate

    def list(self) -> list[Estimate]:
        """Newest first."""
        with self._lock:
            return list(reversed(self._items))

    def clear(self) -> None:
        with self._lock:
            self._items = []