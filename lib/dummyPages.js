import { navMenus } from "./navMenus";

const descriptions = {
  product: {
    "mobile-app":
      "Manage your link in bio on the go. Our mobile app lets you update links, track clicks, and customize your profile from anywhere.",
    "web-platform":
      "The full Linktree experience in your browser. Build, edit, and publish your page with drag-and-drop simplicity.",
    "tools-extensions":
      "Connect your favorite tools—analytics, email capture, social embeds, and more—with one-click extensions.",
    documentation:
      "Guides, API references, and best practices to help you get the most out of your link in bio.",
  },
  templates: {
    creative:
      "Bold layouts for artists, designers, and creators who want their personality to shine through.",
    business:
      "Clean, professional templates built for freelancers, agencies, and small businesses.",
    "music-audio":
      "Showcase releases, tour dates, and streaming links with templates made for musicians.",
    "video-media":
      "Highlight your latest videos, podcasts, and media projects in one polished page.",
  },
  marketplace: {
    featured:
      "Hand-picked themes and add-ons curated by our team for maximum impact.",
    "top-rated":
      "Community favorites with the highest ratings and reviews.",
    "new-releases":
      "Fresh templates and integrations added this month.",
    premium:
      "Exclusive designs and advanced features for power users.",
  },
  learn: {
    tutorials:
      "Step-by-step walkthroughs to set up your page, grow your audience, and drive conversions.",
    courses:
      "In-depth lessons on personal branding, social growth, and monetizing your link in bio.",
    faq:
      "Quick answers to common questions about accounts, billing, and customization.",
    support:
      "Get help from our team—we are here to make sure your page works perfectly.",
  },
  pricing: {
    free: "Everything you need to get started. One link in bio, unlimited links, basic analytics.",
    starter:
      "More customization and insights for growing creators ready to level up.",
    pro: "Advanced branding, priority support, and premium templates for serious creators.",
    enterprise:
      "Custom solutions for teams and brands with dedicated account management.",
  },
};

const titles = {
  product: {
    "mobile-app": "Mobile App",
    "web-platform": "Web Platform",
    "tools-extensions": "Tools & Extensions",
    documentation: "Documentation",
  },
  templates: {
    creative: "Creative Templates",
    business: "Business Templates",
    "music-audio": "Music & Audio Templates",
    "video-media": "Video & Media Templates",
  },
  marketplace: {
    featured: "Featured",
    "top-rated": "Top Rated",
    "new-releases": "New Releases",
    premium: "Premium",
  },
  learn: {
    tutorials: "Tutorials",
    courses: "Courses",
    faq: "FAQ",
    support: "Support",
  },
  pricing: {
    free: "Free Plan",
    starter: "Starter Plan",
    pro: "Pro Plan",
    enterprise: "Enterprise Plan",
  },
};

const categoryLabels = Object.fromEntries(
  navMenus.map((menu) => [menu.key, menu.label])
);

export function getDummyPage(category, slug) {
  const title = titles[category]?.[slug];
  const description = descriptions[category]?.[slug];
  if (!title || !description) return null;

  return {
    category,
    slug,
    categoryLabel: categoryLabels[category],
    title,
    description,
  };
}

export function getAllDummyPageParams() {
  return navMenus.flatMap((menu) =>
    menu.items.map((item) => ({
      category: menu.key,
      slug: item.slug,
    }))
  );
}
