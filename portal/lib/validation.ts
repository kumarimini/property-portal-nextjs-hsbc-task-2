import type { HouseInputs } from "./types";

export type FieldName = keyof HouseInputs;
export type FormValues = Record<FieldName, string>;
export type FormErrors = Partial<Record<FieldName, string>>;

export interface FieldConfig {
  name: FieldName;
  label: string;
  hint: string;
  min: number;
  max: number;
  integer?: boolean;
}

// Single source of truth: the form, the tables and the validation all read this list
export const FIELDS: FieldConfig[] = [
  { name: "square_footage", label: "Square footage", hint: "Living area in sq ft (100 to 20,000)", min: 100, max: 20000 },
  { name: "bedrooms", label: "Bedrooms", hint: "Whole number (0 to 20)", min: 0, max: 20, integer: true },
  { name: "bathrooms", label: "Bathrooms", hint: "Use .5 for half baths (0 to 20)", min: 0, max: 20 },
  { name: "year_built", label: "Year built", hint: "Four-digit year (1800 to 2100)", min: 1800, max: 2100, integer: true },
  { name: "lot_size", label: "Lot size", hint: "Lot area (100 to 1,000,000)", min: 100, max: 1000000 },
  { name: "distance_to_city_center", label: "Distance to city center", hint: "Distance (0 to 100)", min: 0, max: 100 },
  { name: "school_rating", label: "School rating", hint: "Scale of 0 to 10", min: 0, max: 10 },
];

export const emptyValues: FormValues = {
  square_footage: "",
  bedrooms: "",
  bathrooms: "",
  year_built: "",
  lot_size: "",
  distance_to_city_center: "",
  school_rating: "",
};

export const fieldId = (name: FieldName) => `field-${name}`;

export function validateField(name: FieldName, value: string): string | undefined {
  const field = FIELDS.find((f) => f.name === name);
  if (!field) return undefined;

  const raw = value.trim();
  if (raw === "") return `${field.label} is required.`;
  if (!/^-?\d+(\.\d+)?$/.test(raw)) return `${field.label} must be a number.`;

  const num = Number(raw);
  if (field.integer && !Number.isInteger(num)) {
    return `${field.label} must be a whole number.`;
  }
  if (num < field.min) {
    return `${field.label} must be at least ${field.min.toLocaleString("en-US")}.`;
  }
  if (num > field.max) {
    return `${field.label} must be at most ${field.max.toLocaleString("en-US")}.`;
  }
  return undefined;
}

export function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const field of FIELDS) {
    const message = validateField(field.name, values[field.name]);
    if (message) errors[field.name] = message;
  }
  return errors;
}

export function toInputs(values: FormValues): HouseInputs {
  return {
    square_footage: Number(values.square_footage),
    bedrooms: Number(values.bedrooms),
    bathrooms: Number(values.bathrooms),
    year_built: Number(values.year_built),
    lot_size: Number(values.lot_size),
    distance_to_city_center: Number(values.distance_to_city_center),
    school_rating: Number(values.school_rating),
  };
}