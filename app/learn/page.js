import CategoryIndexPage from "@/component/CategoryIndexPage";
import { navMenus } from "@/lib/navMenus";

const menu = navMenus.find((m) => m.key === "learn");

export const metadata = {
  title: "Learn | LinkTree Clone",
  description: "Browse LinkTree Clone learning resources.",
};

export default function LearnIndexPage() {
  return <CategoryIndexPage menu={menu} />;
}
