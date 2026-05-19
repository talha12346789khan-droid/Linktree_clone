import { makeSlugPage } from "@/lib/makeCategoryPage";

const { Page, generateMetadata, generateStaticParams } = makeSlugPage("product");

export { generateMetadata, generateStaticParams };
export default Page;
