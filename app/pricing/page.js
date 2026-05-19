import CategoryIndexPage from "@/component/CategoryIndexPage";
import { navMenus } from "@/lib/navMenus";

const menu = navMenus.find((m) => m.key === "pricing");

export const metadata = {
  title: "Pricing | LinkTree Clone",
  description: "Browse LinkTree Clone pricing plans.",
};

export default function PricingIndexPage() {
  return <CategoryIndexPage menu={menu} />;
}
