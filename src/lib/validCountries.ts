// src/lib/validCountries.ts
// Centralized ISO‑3166‑1 alpha‑2 country code validation.
// Uses the lightweight `country-list` npm package to generate the list at runtime,
// avoiding a massive hard‑coded array and keeping the codebase maintainable.

import { getCodes } from "country-list";

// Export a Set for O(1) look‑ups when validating the phone's country code.
export const VALID_ISO_COUNTRIES = new Set<string>(getCodes());
