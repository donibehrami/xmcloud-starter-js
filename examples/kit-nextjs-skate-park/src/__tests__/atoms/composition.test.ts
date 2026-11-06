import * as definitions from "@/components/atoms";
import { catalog } from "@/atoms/catalog";

jest.mock("@sitecore-feaas/clientside/react", () => ({}));

type CompositionPolicy = {
  allowedParents: string[] | undefined;
  allowedChildren: string[] | undefined;
  slots: string[];
};

const expectedCompositionPolicies: Record<string, CompositionPolicy> = {
  Container: {
    allowedParents: undefined,
    allowedChildren: undefined,
    slots: ["default"],
  },
  Card: {
    allowedParents: undefined,
    allowedChildren: ["CardTitle", "CardContent", "CardFooter"],
    slots: ["title", "content", "footer"],
  },
  CardTitle: {
    allowedParents: ["Card"],
    allowedChildren: [],
    slots: [],
  },
  CardContent: {
    allowedParents: ["Card"],
    allowedChildren: undefined,
    slots: ["default"],
  },
  CardFooter: {
    allowedParents: ["Card"],
    allowedChildren: undefined,
    slots: ["default"],
  },
  Button: { allowedParents: undefined, allowedChildren: [], slots: [] },
  Heading: { allowedParents: undefined, allowedChildren: [], slots: [] },
  Paragraph: { allowedParents: undefined, allowedChildren: [], slots: [] },
  Image: { allowedParents: undefined, allowedChildren: [], slots: [] },
  Number: { allowedParents: undefined, allowedChildren: [], slots: [] },
};

describe("Atom editor composition policies", () => {
  it.each(Object.entries(definitions))(
    "%s declares a parent policy",
    (_, definition) => {
      expect(definition).toHaveProperty("allowedParents");
    },
  );

  it.each(
    Object.entries(definitions).filter(
      ([name]) =>
        ![
          "containerCatalogDefinition",
          "cardCatalogDefinition",
          "cardContentCatalogDefinition",
          "cardFooterCatalogDefinition",
        ].includes(name),
    ),
  )("%s is an editor leaf with no child drop slots", (_, definition) => {
    expect(definition.allowedChildren).toEqual([]);
    expect(definition.slots).toEqual([]);
  });

  it("keeps the composition policies in the catalog used by the editor", () => {
    for (const [name, definition] of Object.entries(catalog.data.components)) {
      const expectedPolicy = expectedCompositionPolicies[name];
      if (!expectedPolicy) {
        throw new Error(`Missing composition policy for "${name}"`);
      }

      expect(definition.allowedParents).toEqual(expectedPolicy.allowedParents);
      expect(definition.allowedChildren).toEqual(
        expectedPolicy.allowedChildren,
      );
      expect(definition.slots).toEqual(expectedPolicy.slots);
    }
    expect(Object.keys(expectedCompositionPolicies)).toHaveLength(
      catalog.componentNames.length,
    );
    expect(Object.keys(definitions)).toHaveLength(
      catalog.componentNames.length,
    );
  });
});
