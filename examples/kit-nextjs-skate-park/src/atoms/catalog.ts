import { defineAtomsCatalog } from "@sitecore-content-sdk/nextjs/atoms";

import { buttonCatalogDefinition } from "@/components/atoms/button/button.schema";
import { headingCatalogDefinition } from "@/components/atoms/heading/heading.schema";
import { imageCatalogDefinition } from "@/components/atoms/image/image.schema";
import { layoutCatalogDefinition } from "@/components/atoms/layout/layout.schema";
import { numberCatalogDefinition } from "@/components/atoms/number/number.schema";
import { paragraphCatalogDefinition } from "@/components/atoms/paragraph/paragraph.schema";
import { superLayoutCatalogDefinition } from "@/components/atoms/super-layout/super-layout.schema";

export const catalog = defineAtomsCatalog({
  version: "1.0.0",
  components: {
    Layout: layoutCatalogDefinition,
    SuperLayout: superLayoutCatalogDefinition,
    Button: buttonCatalogDefinition,
    Heading: headingCatalogDefinition,
    Paragraph: paragraphCatalogDefinition,
    Image: imageCatalogDefinition,
    Number: numberCatalogDefinition,
  },
  actions: {},
});
