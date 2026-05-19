"use client";

export function StarDisplay({ rating, size = "md" }) {
  const sizeClass =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className={`flex gap-0.5 ${sizeClass}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function StarInput({ value, onChange, disabled }) {
  return (
    <div className="flex gap-1" role="group" aria-label="Select rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className={`text-2xl transition hover:scale-110 disabled:opacity-50 ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          }`}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
