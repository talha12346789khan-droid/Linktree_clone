import { makeSlugPage } from "@/lib/makeCategoryPage";

const { Page, generateMetadata, generateStaticParams } = makeSlugPage("learn");

export { generateMetadata, generateStaticParams };
export default Page;
