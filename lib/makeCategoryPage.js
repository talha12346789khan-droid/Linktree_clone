import { notFound } from "next/navigation";
import DummyPage from "@/component/DummyPage";
import { getDummyPage } from "@/lib/dummyPages";
import { navMenus } from "@/lib/navMenus";

export function makeSlugPage(category) {
  const menu = navMenus.find((m) => m.key === category);

  async function Page({ params }) {
    const { slug } = await params;
    const page = getDummyPage(category, slug);
    if (!page) notFound();
    return <DummyPage {...page} />;
  }

  async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = getDummyPage(category, slug);
    if (!page) return { title: "Not Found" };
    return {
      title: `${page.title} | LinkTree Clone`,
      description: page.description,
    };
  }

  function generateStaticParams() {
    return menu.items.map((item) => ({ slug: item.slug }));
  }

  return { Page, generateMetadata, generateStaticParams };
}
