"use client";

import { useEstimateForm } from "@/hooks/useEstimateForm";
import type { HouseInputs } from "@/lib/types";
import { FIELDS, fieldId } from "@/lib/validation";

interface Props {
  onSubmit: (inputs: HouseInputs) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export default function EstimateForm({ onSubmit, isSubmitting, error }: Props) {
  const { values, errors, setValue, onBlur, handleSubmit, reset } = useEstimateForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="form-heading"
      className="rounded-lg border border-line bg-surface p-6"
    >
      <h2 id="form-heading" className="text-xl font-semibold">
        Property details
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const id = fieldId(field.name);
          const message = errors[field.name];
          return (
            <div key={field.name}>
              <label htmlFor={id} className="block text-sm font-medium">
                {field.label}
              </label>
              <input
                id={id}
                name={field.name}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={values[field.name]}
                onChange={(e) => setValue(field.name, e.target.value)}
                onBlur={() => onBlur(field.name)}
                aria-invalid={message ? true : undefined}
                aria-describedby={message ? `${id}-hint ${id}-error` : `${id}-hint`}
                className={`mt-1 w-full rounded-md border bg-white px-3 py-2 ${
                  message ? "border-red-600" : "border-gray-500"
                }`}
              />
              <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
                {field.hint}
              </p>
              {message && (
                <p id={`${id}-error`} className="mt-1 text-sm font-medium text-red-700">
                  {message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? "Estimating…" : "Get estimate"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-gray-500 px-4 py-2 font-medium transition-colors hover:bg-line"
        >
          Reset
        </button>
      </div>
    </form>
  );
}