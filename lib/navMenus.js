export const navMenus = [
  {
    key: "product",
    label: "Product",
    items: [
      { slug: "mobile-app", label: "📱 Mobile App" },
      { slug: "web-platform", label: "🌐 Web Platform" },
      { slug: "tools-extensions", label: "🔧 Tools & Extensions" },
      { slug: "documentation", label: "📚 Documentation", divider: true },
    ],
  },
  {
    key: "templates",
    label: "Templates",
    items: [
      { slug: "creative", label: "🎨 Creative" },
      { slug: "business", label: "💼 Business" },
      { slug: "music-audio", label: "🎵 Music & Audio" },
      { slug: "video-media", label: "🎬 Video & Media", divider: true },
    ],
  },
  {
    key: "marketplace",
    label: "Marketplace",
    items: [
      { slug: "featured", label: "🎯 Featured" },
      { slug: "top-rated", label: "⭐ Top Rated" },
      { slug: "new-releases", label: "🆕 New Releases" },
      { slug: "premium", label: "💎 Premium", divider: true },
    ],
  },
  {
    key: "learn",
    label: "Learn",
    items: [
      { slug: "tutorials", label: "📖 Tutorials" },
      { slug: "courses", label: "🎓 Courses" },
      { slug: "faq", label: "❓ FAQ" },
      { slug: "support", label: "🆘 Support", divider: true },
    ],
  },
  {
    key: "pricing",
    label: "Pricing",
    items: [
      { slug: "free", label: "🆓 Free Plan" },
      { slug: "starter", label: "⭐ Starter" },
      { slug: "pro", label: "🚀 Pro" },
      { slug: "enterprise", label: "👑 Enterprise", divider: true },
    ],
  },
];

export const marketingPrefixes = navMenus.map((menu) => `/${menu.key}`);

export function getNavItemHref(category, slug) {
  return `/${category}/${slug}`;
}
