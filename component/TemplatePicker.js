"use client";

import { TEMPLATES } from "@/lib/templates";

export default function TemplatePicker({ value, onChange, disabled }) {
  return (
    <div className="mb-6">
      <label className="mb-3 block text-sm font-semibold text-gray-700">
        Choose a template
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {TEMPLATES.map((template) => {
          const selected = value === template.id;
          return (
            <button
              key={template.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(template.id)}
              className={`group relative overflow-hidden rounded-xl border-2 p-2 text-left transition ${
                selected
                  ? "border-purple-600 ring-2 ring-purple-300"
                  : "border-gray-200 hover:border-purple-300"
              } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <div
                className={`mb-2 h-14 w-full rounded-lg bg-gradient-to-br ${template.preview}`}
              />
              <p className="truncate text-xs font-bold text-gray-800">
                {template.name}
              </p>
              {selected && (
                <span className="absolute right-1.5 top-1.5 rounded-full bg-purple-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
