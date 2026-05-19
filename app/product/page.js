import CategoryIndexPage from "@/component/CategoryIndexPage";
import { navMenus } from "@/lib/navMenus";

const menu = navMenus.find((m) => m.key === "product");

export const metadata = {
  title: "Product | LinkTree Clone",
  description: "Explore LinkTree Clone product pages.",
};

export default function ProductIndexPage() {
  return <CategoryIndexPage menu={menu} />;
}
