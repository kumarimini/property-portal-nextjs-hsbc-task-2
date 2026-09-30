"use client";

import { useState, type FormEvent } from "react";
import type { HouseInputs } from "@/lib/types";
import {
  FIELDS,
  emptyValues,
  fieldId,
  toInputs,
  validateField,
  validateForm,
  type FieldName,
  type FormErrors,
  type FormValues,
} from "@/lib/validation";

export function useEstimateForm() {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const setValue = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // If the field is already showing an error, re-check it while the user fixes it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const onBlur = (name: FieldName) => {
    setErrors((prev) => ({ ...prev, [name]: validateField(name, values[name]) }));
  };

  const handleSubmit =
    (onValid: (inputs: HouseInputs) => unknown) =>
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const result = validateForm(values);
      setErrors(result);

      const firstInvalid = FIELDS.find((f) => result[f.name]);
      if (firstInvalid) {
        document.getElementById(fieldId(firstInvalid.name))?.focus();
        return;
      }
      onValid(toInputs(values));
    };

  const reset = () => {
    setValues(emptyValues);
    setErrors({});
  };

  return { values, errors, setValue, onBlur, handleSubmit, reset };
}