import CategoryIndexPage from "@/component/CategoryIndexPage";
import { navMenus } from "@/lib/navMenus";

const menu = navMenus.find((m) => m.key === "marketplace");

export const metadata = {
  title: "Marketplace | LinkTree Clone",
  description: "Browse LinkTree Clone marketplace pages.",
};

export default function MarketplaceIndexPage() {
  return <CategoryIndexPage menu={menu} />;
}
