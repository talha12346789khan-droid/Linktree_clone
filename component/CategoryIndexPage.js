import Link from "next/link";
import { getNavItemHref } from "@/lib/navMenus";

export default function CategoryIndexPage({ menu }) {
  return (
    <main className="flex flex-1 flex-col bg-[#d2e823]">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-24 md:py-32">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-900/70">
          Explore
        </p>
        <h1 className="text-3xl font-bold text-cyan-900 md:text-5xl">
          {menu.label}
        </h1>
        <p className="mt-4 text-base text-cyan-900/90 md:text-lg">
          Browse all {menu.label.toLowerCase()} pages in this demo.
        </p>
        <ul className="mt-8 space-y-3">
          {menu.items.map((item) => (
            <li key={item.slug}>
              <Link
                href={getNavItemHref(menu.key, item.slug)}
                className="block rounded-lg border border-cyan-900/15 bg-white/50 px-4 py-3 font-medium text-cyan-900 transition hover:bg-white hover:shadow-sm"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-semibold text-cyan-900 underline-offset-2 hover:underline"
        >
          ← Back to home
        </Link>
      </section>
    </main>
  );
}
