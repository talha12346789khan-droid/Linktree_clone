import Link from "next/link";
import {
  MarketingShell,
  MarketingHero,
  MarketingCard,
  SectionTitle,
  GradientButton,
  Breadcrumb,
} from "@/component/MarketingLayout";

export default function CategoryIndexPage({ data }) {
  const { key, label, tagline, description, items } = data;

  return (
    <MarketingShell>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label, href: `/${key}` },
        ]}
      />

      <MarketingHero categoryLabel="Explore" title={label} tagline={tagline} />

      <MarketingCard className="mb-6">
        <SectionTitle>About {label}</SectionTitle>
        <p className="leading-relaxed text-gray-600 md:text-lg">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GradientButton href="/generate">Get started free</GradientButton>
          <GradientButton href="/" variant="secondary">
            Back to home
          </GradientButton>
        </div>
      </MarketingCard>

      <MarketingCard>
        <SectionTitle>All {label} pages</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-5 transition hover:border-purple-300 hover:bg-white hover:shadow-lg"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-gray-800 group-hover:text-purple-700">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-gray-600">{item.summary}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-purple-600 group-hover:underline">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </MarketingCard>
    </MarketingShell>
  );
}
