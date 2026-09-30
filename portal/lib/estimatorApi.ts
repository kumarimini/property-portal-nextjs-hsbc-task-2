import { ESTIMATOR_API_URL } from "./config";
import type { Estimate, HouseInputs } from "./types";

async function errorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
    if (Array.isArray(body?.detail)) {
      return "The server rejected some of the values. Please check the form and try again.";
    }
  } catch {
    // the response had no JSON body
  }
  return `The request failed (status ${res.status}).`;
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${ESTIMATOR_API_URL}${path}`, { cache: "no-store", ...init });
  } catch {
    throw new Error(
      "Could not reach the estimator service. Please check that it is running."
    );
  }
  if (!res.ok) throw new Error(await errorMessage(res));
  return res;
}

export async function getEstimates(): Promise<Estimate[]> {
  return (await request("/estimates")).json();
}

export async function createEstimate(inputs: HouseInputs): Promise<Estimate> {
  const res = await request("/estimates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputs),
  });
  return res.json();
}

export async function clearEstimates(): Promise<void> {
  await request("/estimates", { method: "DELETE" });
}