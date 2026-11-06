import { defineAtomsCatalog } from "@sitecore-content-sdk/nextjs/atoms";

import { buttonCatalogDefinition } from "@/components/atoms/button/button.schema";
import { headingCatalogDefinition } from "@/components/atoms/heading/heading.schema";
import { imageCatalogDefinition } from "@/components/atoms/image/image.schema";
import { numberCatalogDefinition } from "@/components/atoms/number/number.schema";
import { paragraphCatalogDefinition } from "@/components/atoms/paragraph/paragraph.schema";
import { containerCatalogDefinition } from "@/components/atoms/container/container.schema";
import { cardCatalogDefinition } from "@/components/atoms/card/card.schema";
import { cardTitleCatalogDefinition } from "@/components/atoms/card-title/card-title.schema";
import { cardContentCatalogDefinition } from "@/components/atoms/card-content/card-content.schema";
import { cardFooterCatalogDefinition } from "@/components/atoms/card-footer/card-footer.schema";

export const catalog = defineAtomsCatalog({
  version: "1.0.0",
  components: {
    Container: containerCatalogDefinition,
    Card: cardCatalogDefinition,
    CardTitle: cardTitleCatalogDefinition,
    CardContent: cardContentCatalogDefinition,
    CardFooter: cardFooterCatalogDefinition,
    Button: buttonCatalogDefinition,
    Heading: headingCatalogDefinition,
    Paragraph: paragraphCatalogDefinition,
    Image: imageCatalogDefinition,
    Number: numberCatalogDefinition,
  },
  actions: {},
});
