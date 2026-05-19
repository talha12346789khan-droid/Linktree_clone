import { makeSlugPage } from "@/lib/makeCategoryPage";

const { Page, generateMetadata, generateStaticParams } =
  makeSlugPage("marketplace");

export { generateMetadata, generateStaticParams };
export default Page;
