import { makeSlugPage } from "@/lib/makeCategoryPage";

const { Page, generateMetadata, generateStaticParams } = makeSlugPage("pricing");

export { generateMetadata, generateStaticParams };
export default Page;
