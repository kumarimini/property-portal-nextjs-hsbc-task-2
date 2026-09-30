"use client";

import { useCallback, useState } from "react";

export function useCompareSelection(max = 4) {
  const [ids, setIds] = useState<number[]>([]);

  const toggle = useCallback(
    (id: number) =>
      setIds((prev) =>
        prev.includes(id)
          ? prev.filter((x) => x !== id)
          : prev.length >= max
            ? prev
            : [...prev, id]
      ),
    [max]
  );

  const clear = useCallback(() => setIds([]), []);

  return { ids, toggle, clear, isFull: ids.length >= max };
}