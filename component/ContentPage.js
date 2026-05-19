import Link from "next/link";
import {
  MarketingShell,
  MarketingHero,
  MarketingCard,
  SectionTitle,
  GradientButton,
  Breadcrumb,
} from "@/component/MarketingLayout";
import { getNavItemHref } from "@/lib/navMenus";

export default function ContentPage({
  category,
  categoryLabel,
  slug,
  title,
  icon,
  tagline,
  description,
  overview,
  features,
  highlights,
  stats,
  related,
  faqItems,
  price,
  period,
}) {
  return (
    <MarketingShell>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: categoryLabel, href: `/${category}` },
          { label: title, href: getNavItemHref(category, slug) },
        ]}
      />

      <MarketingHero
        categoryLabel={`${icon} ${categoryLabel}`}
        title={title}
        tagline={tagline}
      />

      {price && (
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-white/20 px-6 py-2 text-2xl font-bold text-white backdrop-blur md:text-3xl">
            {price}
            <span className="ml-2 text-base font-normal text-purple-100">
              / {period}
            </span>
          </span>
        </div>
      )}

      <MarketingCard className="mb-6">
        <SectionTitle>Overview</SectionTitle>
        <p className="leading-relaxed text-gray-600 md:text-lg">{overview}</p>
        <p className="mt-4 rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4 text-sm text-purple-900 md:text-base">
          {description}
        </p>
      </MarketingCard>

      <MarketingCard className="mb-6">
        <SectionTitle>Key features</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:border-purple-200 hover:shadow-md"
            >
              <h3 className="font-bold text-gray-800">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-600 md:text-base">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </MarketingCard>

      {stats?.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-white p-4 text-center shadow-2xl"
            >
              <p className="text-lg font-bold text-purple-600 md:text-2xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-gray-500 md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <MarketingCard className="mb-6">
        <SectionTitle>Why creators choose this</SectionTitle>
        <ul className="space-y-3">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-gray-700 md:text-base"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-xs text-white">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </MarketingCard>

      {faqItems?.length > 0 && (
        <MarketingCard className="mb-6">
          <SectionTitle>Frequently asked questions</SectionTitle>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.q}
                className="rounded-lg border border-gray-100 p-4"
              >
                <h3 className="font-semibold text-gray-800">{item.q}</h3>
                <p className="mt-2 text-sm text-gray-600 md:text-base">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </MarketingCard>
      )}

      <MarketingCard className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <SectionTitle>Ready to get started?</SectionTitle>
        <p className="mb-6 text-gray-600">
          Create your free link in bio in minutes. No credit card required for
          the Free plan.
        </p>
        <div className="flex flex-wrap gap-3">
          <GradientButton href="/generate">Create your linktree</GradientButton>
          <GradientButton href={`/${category}`} variant="secondary">
            Browse {categoryLabel}
          </GradientButton>
          <GradientButton href="/" variant="secondary">
            Back to home
          </GradientButton>
        </div>
      </MarketingCard>

      {related?.length > 0 && (
        <MarketingCard>
          <SectionTitle>Related in {categoryLabel}</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="rounded-lg border border-gray-200 p-4 text-center transition hover:border-purple-400 hover:bg-purple-50 hover:shadow-md"
              >
                <span className="font-semibold text-gray-800">{item.label}</span>
              </Link>
            ))}
          </div>
        </MarketingCard>
      )}
    </MarketingShell>
  );
}
