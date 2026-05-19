import Link from "next/link";

export default function DummyPage({
  categoryLabel,
  title,
  description,
  category,
}) {
  return (
    <main className="flex flex-1 flex-col bg-[#d2e823]">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-24 md:py-32">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-900/70">
          {categoryLabel}
        </p>
        <h1 className="text-3xl font-bold leading-tight text-cyan-900 md:text-5xl">
          {title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-cyan-900/90 md:text-lg">
          {description}
        </p>
        <p className="mt-4 rounded-lg border border-cyan-900/20 bg-white/40 px-4 py-3 text-sm text-cyan-900/80">
          This is a placeholder page for demo purposes. Full features coming
          soon.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to home
          </Link>
          <Link
            href="/generate"
            className="rounded-full border-2 border-cyan-900 px-6 py-3 text-sm font-semibold text-cyan-900 transition hover:bg-cyan-900 hover:text-white"
          >
            Create your linktree
          </Link>
          <Link
            href={`/${category}`}
            className="rounded-full px-6 py-3 text-sm font-semibold text-cyan-900 underline-offset-2 hover:underline"
          >
            More in {categoryLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
