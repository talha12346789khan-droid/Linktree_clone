import { navMenus } from "./navMenus";

const categoryMeta = {
  product: {
    label: "Product",
    indexTagline:
      "Everything you need to build, manage, and grow your link in bio—from mobile to web.",
    indexDescription:
      "LinkTree Clone gives creators one powerful hub for every link they share. Explore our product lineup and see how each piece fits your workflow.",
  },
  templates: {
    label: "Templates",
    indexTagline:
      "Professional layouts designed for every niche—pick a look that matches your brand.",
    indexDescription:
      "Start with a template that fits your audience. Customize colors, fonts, and link order in minutes—no design skills required.",
  },
  marketplace: {
    label: "Marketplace",
    indexTagline:
      "Themes, integrations, and add-ons hand-picked to make your page stand out.",
    indexDescription:
      "Browse curated assets from our community and team. New drops every week so your bio link never feels stale.",
  },
  learn: {
    label: "Learn",
    indexTagline:
      "Guides, courses, and support to help you launch faster and grow smarter.",
    indexDescription:
      "Whether you are setting up your first page or scaling to thousands of clicks, our learning hub has you covered.",
  },
  pricing: {
    label: "Pricing",
    indexTagline:
      "Simple plans that grow with you—from free forever to enterprise scale.",
    indexDescription:
      "No hidden fees. Upgrade when you need more analytics, branding, or team features. Cancel anytime.",
  },
};

const pages = {
  product: {
    "mobile-app": {
      title: "Mobile App",
      icon: "📱",
      tagline: "Your link in bio, always in your pocket.",
      description:
        "Update links, track performance, and customize your profile from iOS and Android.",
      overview:
        "The LinkTree Clone mobile app mirrors everything you love about the web dashboard—optimized for speed on the go. Push notifications alert you when links spike in traffic, and offline mode lets you draft changes before you are back online.",
      features: [
        {
          title: "Real-time sync",
          text: "Edits on mobile appear on your live page within seconds.",
        },
        {
          title: "Click analytics",
          text: "See top-performing links with daily and weekly breakdowns.",
        },
        {
          title: "Quick add links",
          text: "Paste a URL and we auto-fetch title and icon when possible.",
        },
        {
          title: "Profile preview",
          text: "Preview exactly how visitors see your page before publishing.",
        },
      ],
      highlights: [
        "Available on iOS 15+ and Android 10+",
        "Biometric login for account security",
        "Widget for home screen quick stats",
        "Share your page via QR code instantly",
      ],
      stats: [
        { label: "App store rating", value: "4.8★" },
        { label: "Avg. setup time", value: "3 min" },
        { label: "Daily active users", value: "120K+" },
      ],
    },
    "web-platform": {
      title: "Web Platform",
      icon: "🌐",
      tagline: "The full creator studio in your browser.",
      description:
        "Build, edit, and publish your link in bio with drag-and-drop simplicity.",
      overview:
        "Our web platform is the command center for your digital presence. Organize unlimited links, upload a profile image, and reorder blocks with intuitive drag-and-drop. Collaborators can request access for team-managed accounts.",
      features: [
        {
          title: "Visual editor",
          text: "Arrange links and sections without touching code.",
        },
        {
          title: "Custom handle",
          text: "Claim a unique @handle that becomes your public URL.",
        },
        {
          title: "Social icons",
          text: "Auto-detect platforms and show branded icons on each link.",
        },
        {
          title: "One-click publish",
          text: "Go live instantly—changes propagate globally via CDN.",
        },
      ],
      highlights: [
        "Works in Chrome, Safari, Firefox, and Edge",
        "Responsive preview for mobile and desktop",
        "Import links from Instagram bio in one click",
        "Export analytics as CSV",
      ],
      stats: [
        { label: "Pages created", value: "2M+" },
        { label: "Uptime", value: "99.9%" },
        { label: "Countries", value: "190+" },
      ],
    },
    "tools-extensions": {
      title: "Tools & Extensions",
      icon: "🔧",
      tagline: "Connect the apps you already use.",
      description:
        "Analytics, email capture, embeds, and more—plug in with one click.",
      overview:
        "Extensions supercharge your link page without slow load times. Enable only what you need: Google Analytics, Mailchimp signup forms, Spotify embeds, Calendly booking, and dozens more. Each integration is tested for mobile performance.",
      features: [
        {
          title: "Analytics suite",
          text: "Track clicks, referrers, and device types per link.",
        },
        {
          title: "Email capture",
          text: "Grow your list with inline signup forms on your page.",
        },
        {
          title: "Media embeds",
          text: "Show YouTube, TikTok, or Spotify players inline.",
        },
        {
          title: "Commerce links",
          text: "Highlight shop, Gumroad, or Stripe payment pages.",
        },
      ],
      highlights: [
        "40+ integrations and growing",
        "No code required to enable",
        "GDPR-friendly cookie controls",
        "Disable extensions anytime without losing data",
      ],
      stats: [
        { label: "Integrations", value: "40+" },
        { label: "Setup avg.", value: "< 1 min" },
        { label: "Partner apps", value: "25" },
      ],
    },
    documentation: {
      title: "Documentation",
      icon: "📚",
      tagline: "Guides and references to build with confidence.",
      description:
        "API docs, tutorials, and best practices for power users and developers.",
      overview:
        "Our documentation hub covers everything from creating your first link to advanced API usage. Searchable articles, copy-paste examples, and changelog entries keep you aligned with the latest platform updates.",
      features: [
        {
          title: "Getting started",
          text: "Step-by-step setup for new accounts and first publish.",
        },
        {
          title: "API reference",
          text: "REST endpoints for links, handles, and analytics.",
        },
        {
          title: "Best practices",
          text: "SEO tips, link ordering, and conversion optimization.",
        },
        {
          title: "Changelog",
          text: "Track new features and breaking changes by version.",
        },
      ],
      highlights: [
        "Search across all articles",
        "Code samples in JavaScript and curl",
        "Webhook guides for automation",
        "Community-contributed tips section",
      ],
      stats: [
        { label: "Articles", value: "85+" },
        { label: "API endpoints", value: "12" },
        { label: "Updated", value: "Weekly" },
      ],
    },
  },
  templates: {
    creative: {
      title: "Creative Templates",
      icon: "🎨",
      tagline: "Bold layouts for artists and makers.",
      description:
        "Express your personality with vibrant colors and asymmetric layouts.",
      overview:
        "Creative templates prioritize visual impact—large hero images, gradient accents, and flexible link cards. Perfect for illustrators, photographers, and indie brands who want their page to feel like a portfolio, not a boring list.",
      features: [
        { title: "Gallery blocks", text: "Showcase image grids above your links." },
        { title: "Custom fonts", text: "Pair display and body fonts from our library." },
        { title: "Accent colors", text: "Pick gradients that match your brand palette." },
        { title: "Animation hints", text: "Subtle hover effects on link buttons." },
      ],
      highlights: [
        "12 creative presets included free",
        "Upload custom background images",
        "Dark and light mode variants",
        "Optimized for Instagram traffic",
      ],
      stats: [
        { label: "Templates", value: "12" },
        { label: "Avg. CTR lift", value: "+18%" },
        { label: "Uses", value: "340K" },
      ],
    },
    business: {
      title: "Business Templates",
      icon: "💼",
      tagline: "Professional pages that build trust.",
      description:
        "Clean layouts for freelancers, agencies, and small businesses.",
      overview:
        "Business templates use restrained typography, clear hierarchy, and prominent CTAs. Add your logo, tagline, and key offers—consulting calls, portfolio PDFs, or contact forms—without cluttering the mobile view.",
      features: [
        { title: "Logo header", text: "Centered brand mark with optional tagline." },
        { title: "CTA buttons", text: "Highlight booking or contact links first." },
        { title: "Testimonial slot", text: "Optional quote block for social proof." },
        { title: "Footer links", text: "Privacy, terms, and social icons in one row." },
      ],
      highlights: [
        "Looks great on LinkedIn bio clicks",
        "Print-friendly PDF export of layout",
        "WCAG contrast checked",
        "Works with custom domains (Pro)",
      ],
      stats: [
        { label: "Templates", value: "8" },
        { label: "B2B users", value: "95K" },
        { label: "Satisfaction", value: "96%" },
      ],
    },
    "music-audio": {
      title: "Music & Audio Templates",
      icon: "🎵",
      tagline: "Stream, tour, and merch—in one link.",
      description:
        "Built for musicians, DJs, and podcasters sharing releases and dates.",
      overview:
        "Music templates embed streaming players, tour date lists, and merch store links in a layout fans recognize. Pin your latest single at the top and archive older releases below the fold.",
      features: [
        { title: "Streaming embeds", text: "Spotify, Apple Music, and SoundCloud players." },
        { title: "Tour dates", text: "List upcoming shows with ticket links." },
        { title: "Merch row", text: "Grid of shop items with cover art." },
        { title: "Fan signup", text: "Email capture for release announcements." },
      ],
      highlights: [
        "Pre-release landing page mode",
        "Link to pre-save campaigns",
        "Podcast RSS-friendly layout",
        "Band member social links section",
      ],
      stats: [
        { label: "Artists", value: "28K" },
        { label: "Streams driven", value: "1.2M/mo" },
        { label: "Templates", value: "6" },
      ],
    },
    "video-media": {
      title: "Video & Media Templates",
      icon: "🎬",
      tagline: "Your channel hub for every platform.",
      description:
        "Highlight YouTube, TikTok, and podcast links in a media-first layout.",
      overview:
        "Video templates put your latest upload front and center with autoplay-disabled embeds that respect mobile data. Group links by series, playlist, or sponsor—and rotate featured content weekly.",
      features: [
        { title: "Featured video", text: "Embed your newest upload at the top." },
        { title: "Platform badges", text: "Icons for YouTube, TikTok, Twitch, and more." },
        { title: "Playlist groups", text: "Collapsible sections per series or topic." },
        { title: "Sponsor slot", text: "Dedicated area for brand partnerships." },
      ],
      highlights: [
        "Thumbnail previews for each link",
        "Chapters support for long-form video",
        "Affiliate disclosure footer option",
        "High click-through on mobile",
      ],
      stats: [
        { label: "Creators", value: "41K" },
        { label: "Avg. watch-through", value: "+22%" },
        { label: "Templates", value: "7" },
      ],
    },
  },
  marketplace: {
    featured: {
      title: "Featured",
      icon: "🎯",
      tagline: "Curated picks from our design team.",
      description:
        "Hand-selected themes and add-ons for maximum visual impact.",
      overview:
        "Featured items rotate monthly based on trends, seasonality, and community feedback. Each listing includes live previews, compatibility notes, and estimated setup time so you know what you are getting before install.",
      features: [
        { title: "Editor's choice", text: "Top 5 themes updated every month." },
        { title: "Bundle deals", text: "Save when combining theme + analytics pack." },
        { title: "Live preview", text: "Try on your handle before purchasing." },
        { title: "Reviews", text: "Read ratings from verified creators." },
      ],
      highlights: [
        "New featured drop first Monday of month",
        "30-day satisfaction guarantee on paid items",
        "Free items clearly labeled",
        "One-click apply to your page",
      ],
      stats: [
        { label: "Featured items", value: "24" },
        { label: "Avg. rating", value: "4.7★" },
        { label: "Installs", value: "500K" },
      ],
    },
    "top-rated": {
      title: "Top Rated",
      icon: "⭐",
      tagline: "Community favorites that deliver results.",
      description:
        "Highest-rated themes and tools chosen by real creators.",
      overview:
        "Top-rated listings need at least 100 reviews and a 4.5+ average to qualify. Sort by niche, price, or recency—and see which templates power the most-clicked pages in our network.",
      features: [
        { title: "Verified reviews", text: "Only accounts with published pages can rate." },
        { title: "Sort filters", text: "Filter by creator type, price, and style." },
        { title: "Compare mode", text: "Side-by-side preview of two themes." },
        { title: "Trend badges", text: "See what is climbing the charts this week." },
      ],
      highlights: [
        "Updated rankings every 24 hours",
        "Hall of fame for all-time bests",
        "Refund policy on paid themes",
        "Creator spotlight interviews",
      ],
      stats: [
        { label: "4.5+ items", value: "180" },
        { label: "Reviews", value: "50K+" },
        { label: "Return rate", value: "< 2%" },
      ],
    },
    "new-releases": {
      title: "New Releases",
      icon: "🆕",
      tagline: "Fresh drops for your next refresh.",
      description:
        "Templates and integrations added this month.",
      overview:
        "Stay ahead with the latest designs and partner integrations. New releases ship with launch discounts and early-access badges you can show on your profile.",
      features: [
        { title: "Launch calendar", text: "See upcoming drops and notify me opt-in." },
        { title: "Early access", text: "Pro users try new items 7 days early." },
        { title: "Release notes", text: "Changelog per item with screenshots." },
        { title: "Beta feedback", text: "Rate pre-release items and shape updates." },
      ],
      highlights: [
        "5–10 new items per month",
        "Limited-time launch pricing",
        "Compatible with all plans",
        "Migration guide from old themes",
      ],
      stats: [
        { label: "This month", value: "9 new" },
        { label: "Early access", value: "Pro" },
        { label: "Discount", value: "Up to 30%" },
      ],
    },
    premium: {
      title: "Premium",
      icon: "💎",
      tagline: "Exclusive designs for serious creators.",
      description:
        "Advanced layouts, animations, and priority support included.",
      overview:
        "Premium marketplace items include exclusive fonts, motion backgrounds, custom CSS slots, and dedicated support channels. Ideal for brands and full-time creators who treat their bio link as a flagship asset.",
      features: [
        { title: "Exclusive themes", text: "Not available on free or starter plans." },
        { title: "Motion backgrounds", text: "Subtle loops that do not hurt load time." },
        { title: "Custom CSS", text: "Advanced slot for brand-specific tweaks." },
        { title: "Priority support", text: "24h response from design specialists." },
      ],
      highlights: [
        "Lifetime updates for purchased items",
        "License covers commercial use",
        "White-glove install assistance",
        "Bundle with Pro plan for savings",
      ],
      stats: [
        { label: "Premium items", value: "45" },
        { label: "Pro users", value: "12K" },
        { label: "Support SLA", value: "24h" },
      ],
    },
  },
  learn: {
    tutorials: {
      title: "Tutorials",
      icon: "📖",
      tagline: "Step-by-step guides for every skill level.",
      description:
        "Walkthroughs to set up, customize, and grow your link in bio.",
      overview:
        "Our tutorial library covers account setup, link strategy, analytics interpretation, and platform-specific tips for Instagram, TikTok, and YouTube bios. Each guide includes screenshots and estimated completion time.",
      features: [
        { title: "Quick starts", text: "5-minute guides for first-time users." },
        { title: "Video walkthroughs", text: "Watch and follow along on mobile." },
        { title: "Printable checklists", text: "Download PDF launch checklists." },
        { title: "Topic paths", text: "Curated sequences from beginner to pro." },
      ],
      highlights: [
        "50+ tutorials and growing",
        "Updated when UI changes",
        "Available in English (more soon)",
        "Bookmark progress in your account",
      ],
      stats: [
        { label: "Guides", value: "50+" },
        { label: "Avg. read time", value: "8 min" },
        { label: "Completion rate", value: "78%" },
      ],
    },
    courses: {
      title: "Courses",
      icon: "🎓",
      tagline: "Deep dives into branding and growth.",
      description:
        "Structured lessons on personal brand, social growth, and monetization.",
      overview:
        "Courses bundle tutorials into multi-week paths with quizzes and certificates. Learn how to optimize link order, write CTAs that convert, and pair your bio link with email and product funnels.",
      features: [
        { title: "Brand foundations", text: "Define voice, visuals, and audience." },
        { title: "Growth tactics", text: "Cross-promote across social platforms." },
        { title: "Monetization", text: "Sell digital products from one link." },
        { title: "Certificates", text: "Share completion badges on your page." },
      ],
      highlights: [
        "3 free courses, 8 Pro-only",
        "Self-paced with lifetime access",
        "Community discussion per lesson",
        "New course each quarter",
      ],
      stats: [
        { label: "Courses", value: "11" },
        { label: "Students", value: "22K" },
        { label: "Avg. rating", value: "4.9★" },
      ],
    },
    faq: {
      title: "FAQ",
      icon: "❓",
      tagline: "Quick answers to common questions.",
      description:
        "Accounts, billing, handles, and customization—answered.",
      overview:
        "Browse by topic or search keywords. Our FAQ is the fastest way to resolve setup issues without contacting support. Still stuck? Every answer links to related tutorials or support options.",
      features: [
        { title: "Account & login", text: "GitHub, Google sign-in, and password help." },
        { title: "Handles & links", text: "One handle per account, editing rules." },
        { title: "Billing", text: "Plans, upgrades, refunds, and invoices." },
        { title: "Privacy", text: "Data storage, cookies, and deletion." },
      ],
      highlights: [
        "200+ answered questions",
        "Search with instant results",
        "Updated within 48h of new features",
        "Was this helpful? feedback on each article",
      ],
      stats: [
        { label: "Articles", value: "200+" },
        { label: "Self-serve rate", value: "85%" },
        { label: "Languages", value: "1" },
      ],
      faqItems: [
        {
          q: "Can I change my handle after creating it?",
          a: "Handles are locked after creation to keep your public URL stable. Upgrade options may allow changes depending on your plan.",
        },
        {
          q: "How many links can I add?",
          a: "There is no hard limit—add as many links as you need. Performance stays fast with our global CDN.",
        },
        {
          q: "Is the free plan really free?",
          a: "Yes. Core features including unlimited links and basic analytics are included on the Free plan at no cost.",
        },
      ],
    },
    support: {
      title: "Support",
      icon: "🆘",
      tagline: "We are here when you need a human.",
      description:
        "Contact our team for technical issues, billing, or account help.",
      overview:
        "Support channels include email, in-app chat (Pro), and community forums. Submit a ticket with your handle and we typically respond within one business day—faster for Pro and Enterprise plans.",
      features: [
        { title: "Ticket system", text: "Track status and history in your dashboard." },
        { title: "Community forum", text: "Ask peers and browse solved threads." },
        { title: "Status page", text: "Real-time uptime and incident updates." },
        { title: "Escalation", text: "Priority queue for paid plans." },
      ],
      highlights: [
        "Mon–Fri 9am–6pm UTC coverage",
        "Average first reply under 12 hours",
        "Screen-share available for Enterprise",
        "Dedicated manager for Enterprise accounts",
      ],
      stats: [
        { label: "Satisfaction", value: "94%" },
        { label: "First reply", value: "< 12h" },
        { label: "Tickets/mo", value: "3K" },
      ],
    },
  },
  pricing: {
    free: {
      title: "Free Plan",
      icon: "🆓",
      tagline: "Everything you need to launch—$0 forever.",
      description:
        "Unlimited links, one handle, and basic analytics at no cost.",
      overview:
        "The Free plan is perfect for new creators testing their first link in bio. You get full access to core editing, social icons, and public profile pages. Upgrade anytime when you need deeper insights or premium templates.",
      features: [
        { title: "Unlimited links", text: "Add as many destinations as you need." },
        { title: "One handle", text: "Your unique public profile URL (@yourhandle)." },
        { title: "Basic analytics", text: "7-day click history per link." },
        { title: "Standard templates", text: "Access to free template library." },
      ],
      highlights: [
        "No credit card required",
        "Free forever, not a trial",
        "Community support via forums",
        "LinkTree Clone branding on page",
      ],
      stats: [
        { label: "Price", value: "$0" },
        { label: "Links", value: "Unlimited" },
        { label: "Analytics", value: "7 days" },
      ],
      price: "$0",
      period: "forever",
    },
    starter: {
      title: "Starter Plan",
      icon: "⭐",
      tagline: "More insights and customization for growing creators.",
      description:
        "Extended analytics, custom themes, and email capture.",
      overview:
        "Starter is our most popular paid tier—ideal when you have consistent traffic and want to understand what resonates. Remove default branding, unlock 30-day analytics, and enable a simple email signup form on your page.",
      features: [
        { title: "30-day analytics", text: "Trends, referrers, and device breakdowns." },
        { title: "Custom themes", text: "All starter-tier marketplace templates." },
        { title: "Email capture", text: "Collect subscribers on your page." },
        { title: "Reduced branding", text: "Smaller footer credit on your profile." },
      ],
      highlights: [
        "Billed monthly or annually (save 20%)",
        "Cancel anytime from dashboard",
        "Priority email support",
        "Free migration from Free plan",
      ],
      stats: [
        { label: "Price", value: "$5/mo" },
        { label: "Analytics", value: "30 days" },
        { label: "Themes", value: "25+" },
      ],
      price: "$5",
      period: "per month",
    },
    pro: {
      title: "Pro Plan",
      icon: "🚀",
      tagline: "Advanced branding and tools for full-time creators.",
      description:
        "Premium templates, priority support, and full analytics history.",
      overview:
        "Pro unlocks the complete marketplace, custom CSS, advanced integrations, and 12-month analytics retention. Perfect for influencers, coaches, and small brands who rely on their bio link as a primary conversion point.",
      features: [
        { title: "Premium templates", text: "All marketplace items included." },
        { title: "Custom CSS", text: "Fine-tune layout beyond template defaults." },
        { title: "Integrations", text: "Full extension library and webhooks." },
        { title: "12-month analytics", text: "Export and compare year-over-year." },
      ],
      highlights: [
        "24h priority support",
        "Early access to new releases",
        "Custom domain support",
        "Team collaborator (1 seat)",
      ],
      stats: [
        { label: "Price", value: "$12/mo" },
        { label: "Analytics", value: "12 mo" },
        { label: "Support", value: "24h" },
      ],
      price: "$12",
      period: "per month",
    },
    enterprise: {
      title: "Enterprise Plan",
      icon: "👑",
      tagline: "Custom solutions for teams and large brands.",
      description:
        "Dedicated support, SSO, SLAs, and unlimited team seats.",
      overview:
        "Enterprise is built for agencies and companies managing multiple brands. Get a dedicated account manager, custom contracts, SSO/SAML login, audit logs, and white-label options. Pricing is tailored to your organization size and needs.",
      features: [
        { title: "Unlimited seats", text: "Role-based access for your whole team." },
        { title: "SSO / SAML", text: "Connect your identity provider." },
        { title: "SLA & uptime", text: "99.99% commitment with credits." },
        { title: "White-label", text: "Remove all platform branding." },
      ],
      highlights: [
        "Custom invoicing and NET-30 terms",
        "Onboarding workshop included",
        "Quarterly business reviews",
        "API rate limits increased 10x",
      ],
      stats: [
        { label: "Price", value: "Custom" },
        { label: "Seats", value: "Unlimited" },
        { label: "SLA", value: "99.99%" },
      ],
      price: "Custom",
      period: "contact sales",
    },
  },
};

const categoryLabels = Object.fromEntries(
  navMenus.map((menu) => [menu.key, menu.label])
);

function getRelatedItems(category, currentSlug) {
  const menu = navMenus.find((m) => m.key === category);
  if (!menu) return [];
  return menu.items
    .filter((item) => item.slug !== currentSlug)
    .slice(0, 3)
    .map((item) => ({
      slug: item.slug,
      label: item.label,
      href: `/${category}/${item.slug}`,
    }));
}

export function getCategoryIndex(category) {
  const meta = categoryMeta[category];
  const menu = navMenus.find((m) => m.key === category);
  if (!meta || !menu) return null;

  const items = menu.items.map((item) => {
    const page = pages[category]?.[item.slug];
    return {
      ...item,
      href: `/${category}/${item.slug}`,
      title: page?.title || item.label.replace(/^[^\s]+\s/, ""),
      icon: page?.icon || "✨",
      summary: page?.description || "",
    };
  });

  return {
    key: category,
    label: meta.label,
    tagline: meta.indexTagline,
    description: meta.indexDescription,
    items,
  };
}

export function getContentPage(category, slug) {
  const page = pages[category]?.[slug];
  if (!page) return null;

  return {
    category,
    slug,
    categoryLabel: categoryLabels[category],
    related: getRelatedItems(category, slug),
    ...page,
  };
}

export function getAllContentSlugs() {
  return navMenus.flatMap((menu) =>
    menu.items.map((item) => ({
      category: menu.key,
      slug: item.slug,
    }))
  );
}
