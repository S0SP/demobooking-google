// src/components/TimezoneSelector.tsx
"use client";

import { useMemo } from "react";
import Select, {
  components,
  type SingleValueProps,
  type OptionProps,
  type ControlProps,
  type GroupBase,
  type StylesConfig,
} from "react-select";
import ct from "countries-and-timezones";
import { Globe } from "lucide-react";

/* ── Types ────────────────────────────────────────────────────── */
interface TZOption {
  value: string;       // "Asia/Kolkata"
  label: string;       // "Kolkata — UTC+5:30"
  offset: string;      // "UTC+5:30"
  offsetMinutes: number;
  countryName: string; // "India"
  countryIso: string;  // "IN"
  city: string;        // "Kolkata"
}

/* ── Build options from countries-and-timezones library ───────── 
   LTS: countries-and-timezones 3.x
   Backed by IANA timezone database — updated with each TZ release
──────────────────────────────────────────────────────────────── */
function buildOptions(detectedCountry?: string): TZOption[] {
  const allTimezones = ct.getAllTimezones();

  const options: TZOption[] = Object.values(allTimezones)
    .filter((tz) => tz.countries && tz.countries.length > 0)
    .map((tz) => {
      const offsetMins = tz.utcOffset;
      const abs = Math.abs(offsetMins);
      const h = String(Math.floor(abs / 60)).padStart(2, "0");
      const m = String(abs % 60).padStart(2, "0");
      const sign = offsetMins >= 0 ? "+" : "-";
      const offset = `GMT${sign}${h}:${m}`;

      const iso = tz.countries[0];
      const country = ct.getCountry(iso);
      const countryName = country?.name ?? iso;
      const city =
        tz.name.split("/").pop()?.replace(/_/g, " ") ?? tz.name;

      return {
        value: tz.name,
        label: `(${offset}) ${city}`,
        offset,
        offsetMinutes: offsetMins,
        countryName,
        countryIso: iso,
        city,
      };
    });

  // Deduplicate
  const seen = new Set<string>();
  const deduped = options.filter((o) => {
    if (seen.has(o.value)) return false;
    seen.add(o.value);
    return true;
  });

  // Sort: detected country first, then by offset
  return deduped.sort((a, b) => {
    if (detectedCountry) {
      const aMatch = a.countryIso === detectedCountry;
      const bMatch = b.countryIso === detectedCountry;
      if (aMatch && !bMatch) return -1;
      if (bMatch && !aMatch) return 1;
    }
    return a.offsetMinutes - b.offsetMinutes;
  });
}

/* ── Custom Option with flag-icons ───────────────────────────── */
function TZOption(
  props: OptionProps<TZOption, false, GroupBase<TZOption>>
) {
  const { data, isSelected, isFocused } = props;
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between gap-3 py-0.5">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* flag-icons CSS — no SVG hardcoding */}
          <span
            className={`fi fi-${data.countryIso.toLowerCase()} rounded-sm flex-shrink-0`}
            style={{ width: "18px", height: "13px" }}
            aria-hidden="true"
          />
          <span
            className={`text-sm truncate font-medium ${
              isSelected ? "text-white" : "text-slate-700"
            }`}
          >
            {data.countryName} — {data.city}
          </span>
        </div>
        <span
          className={`text-xs font-mono flex-shrink-0 ${
            isSelected
              ? "text-white/80"
              : isFocused
              ? "text-slate-600"
              : "text-slate-400"
          }`}
        >
          {data.offset}
        </span>
      </div>
    </components.Option>
  );
}

/* ── Custom SingleValue display ───────────────────────────────── */
function TZSingleValue(
  props: SingleValueProps<TZOption, false, GroupBase<TZOption>>
) {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <span className="text-sm font-medium text-slate-800">
        {data.label}
      </span>
    </components.SingleValue>
  );
}

/* ── Custom Control with blue globe icon ────────────────────── */
function TZControl(
  props: ControlProps<TZOption, false, GroupBase<TZOption>>
) {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <Globe className="w-4 h-4 text-blue-500" />
      </div>
      <components.Control {...props} />
    </div>
  );
}

/* ── react-select styles — no Tailwind conflicts ──────────────── */
const selectStyles: StylesConfig<TZOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "12px",
    paddingLeft: "32px",
    borderColor: state.isFocused
      ? "var(--brand-blue)"
      : "#e2e8f0",
    boxShadow: state.isFocused
      ? "0 0 0 2px color-mix(in srgb, var(--brand-blue) 20%, transparent)"
      : "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    "&:hover": { borderColor: "#cbd5e1" },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 12px",
  }),
  input: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#0f172a",
    margin: 0,
    padding: 0,
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#94a3b8",
    fontWeight: 400,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    boxShadow:
      "0 20px 40px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
    overflow: "hidden",
    zIndex: 200,
  }),
  menuList: (base) => ({
    ...base,
    padding: "4px",
    maxHeight: "240px",
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: "8px",
    backgroundColor: state.isSelected
      ? "var(--brand-blue)"
      : state.isFocused
      ? "#f8fafc"
      : "transparent",
    color: state.isSelected ? "#ffffff" : "#334155",
    padding: "8px 12px",
    cursor: "pointer",
    "&:active": {
      backgroundColor: state.isSelected
        ? "var(--brand-blue)"
        : "#f1f5f9",
    },
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#94a3b8",
    padding: "0 8px",
    "&:hover": { color: "#64748b" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  noOptionsMessage: (base) => ({
    ...base,
    fontSize: "13px",
    color: "#94a3b8",
    padding: "12px",
  }),
};

/* ── Main Export ──────────────────────────────────────────────── */
export interface TimezoneSelectorProps {
  value: string;
  onChange: (tz: string) => void;
  detectedCountry?: string;
}

export function TimezoneSelector({
  value,
  onChange,
  detectedCountry,
}: TimezoneSelectorProps) {
  const options = useMemo(
    () => buildOptions(detectedCountry),
    [detectedCountry]
  );

  const selectedOption = options.find((o) => o.value === value) ?? null;

  return (
    <Select<TZOption>
      instanceId="timezone-selector"
      options={options}
      value={selectedOption}
      onChange={(opt) => opt && onChange(opt.value)}
      placeholder="Search timezone or country..."
      isSearchable
      components={{
        Option: TZOption,
        SingleValue: TZSingleValue,
        Control: TZControl,
      }}
      styles={selectStyles}
      filterOption={(option, input) => {
        if (!input) return true;
        const q = input.toLowerCase();
        return (
          option.data.countryName.toLowerCase().includes(q) ||
          option.data.city.toLowerCase().includes(q) ||
          option.data.offset.toLowerCase().includes(q) ||
          option.data.value.toLowerCase().includes(q)
        );
      }}
      noOptionsMessage={({ inputValue }) =>
        `No timezone found for "${inputValue}"`
      }
    />
  );
}
