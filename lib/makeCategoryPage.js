import { notFound } from "next/navigation";
import ContentPage from "@/component/ContentPage";
import { getContentPage } from "@/lib/content";
import { navMenus } from "@/lib/navMenus";

export function makeSlugPage(category) {
  const menu = navMenus.find((m) => m.key === category);

  async function Page({ params }) {
    const { slug } = await params;
    const page = getContentPage(category, slug);
    if (!page) notFound();
    return <ContentPage {...page} />;
  }

  async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = getContentPage(category, slug);
    if (!page) return { title: "Not Found" };
    return {
      title: `${page.title} | LinkTree Clone`,
      description: page.tagline || page.description,
    };
  }

  function generateStaticParams() {
    return menu.items.map((item) => ({ slug: item.slug }));
  }

  return { Page, generateMetadata, generateStaticParams };
}
