import CategoryIndexPage from "@/component/CategoryIndexPage";
import { navMenus } from "@/lib/navMenus";

const menu = navMenus.find((m) => m.key === "templates");

export const metadata = {
  title: "Templates | LinkTree Clone",
  description: "Browse LinkTree Clone template pages.",
};

export default function TemplatesIndexPage() {
  return <CategoryIndexPage menu={menu} />;
}
