import CategoryIndexPage from "@/component/CategoryIndexPage";
import { getCategoryIndex } from "@/lib/content";

export function makeCategoryIndexPage(category) {
  const data = getCategoryIndex(category);

  function Page() {
    return <CategoryIndexPage data={data} />;
  }

  const metadata = {
    title: `${data.label} | LinkTree Clone`,
    description: data.description,
  };

  return { Page, metadata };
}
