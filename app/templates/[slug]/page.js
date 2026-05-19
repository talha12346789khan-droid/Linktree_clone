import { makeSlugPage } from "@/lib/makeCategoryPage";

const { Page, generateMetadata, generateStaticParams } = makeSlugPage("templates");

export { generateMetadata, generateStaticParams };
export default Page;
