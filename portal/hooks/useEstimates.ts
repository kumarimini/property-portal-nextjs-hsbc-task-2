"use client";

import { useCallback, useState } from "react";
import { clearEstimates, createEstimate, getEstimates } from "@/lib/estimatorApi";
import type { Estimate, HouseInputs } from "@/lib/types";

const MAX_HISTORY = 100;

const messageFrom = (e: unknown) =>
  e instanceof Error ? e.message : "Something went wrong. Please try again.";

export function useEstimates(initialHistory: Estimate[], initialError: string | null) {
  const [history, setHistory] = useState<Estimate[]>(initialHistory);
  const [loadError, setLoadError] = useState<string | null>(initialError);
  const [latest, setLatest] = useState<Estimate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (inputs: HouseInputs) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const estimate = await createEstimate(inputs);
      setLatest(estimate);
      setHistory((prev) => [estimate, ...prev].slice(0, MAX_HISTORY));
    } catch (e) {
      setError(messageFrom(e));
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clear = useCallback(async () => {
    setError(null);
    try {
      await clearEstimates();
      setHistory([]);
      setLatest(null);
      return true;
    } catch (e) {
      setError(messageFrom(e));
      return false;
    }
  }, []);

  const reload = useCallback(async () => {
    try {
      setHistory(await getEstimates());
      setLoadError(null);
    } catch (e) {
      setLoadError(messageFrom(e));
    }
  }, []);

  return { history, latest, loadError, isSubmitting, error, submit, clear, reload };
}