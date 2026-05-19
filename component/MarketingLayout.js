import Link from "next/link";

export function MarketingShell({ children }) {
  return (
    <main className="flex flex-1 flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-4 md:p-6">
      <div className="mx-auto my-4 w-full max-w-4xl pt-20 md:my-10 md:pt-24">
        {children}
      </div>
    </main>
  );
}

export function MarketingHero({ categoryLabel, title, tagline }) {
  return (
    <div className="mb-6 text-center md:mb-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-purple-200 md:text-sm">
        {categoryLabel}
      </p>
      <h1 className="text-2xl font-bold text-white md:text-4xl lg:text-5xl">
        {title}
      </h1>
      {tagline && (
        <p className="mx-auto mt-3 max-w-2xl text-sm text-purple-100 md:text-base lg:text-lg">
          {tagline}
        </p>
      )}
    </div>
  );
}

export function MarketingCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-lg bg-white p-5 shadow-2xl md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <h2 className="mb-4 text-lg font-bold text-gray-800 md:text-2xl">
      {children}
    </h2>
  );
}

export function GradientButton({ href, children, variant = "primary" }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold transition md:text-base";
  const styles =
    variant === "primary"
      ? `${base} bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02]`
      : `${base} border-2 border-purple-600 text-purple-700 hover:bg-purple-50`;

  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-purple-200 md:text-sm">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-2">
          {i > 0 && <span className="text-purple-300">/</span>}
          <Link href={item.href} className="hover:text-white transition">
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
