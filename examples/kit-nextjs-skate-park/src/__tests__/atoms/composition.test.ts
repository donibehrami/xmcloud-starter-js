import * as definitions from "@/components/atoms";
import { catalog } from "@/atoms/catalog";

jest.mock("@sitecore-feaas/clientside/react", () => ({}));

describe("Atom editor composition policies", () => {
  it.each(Object.entries(definitions))(
    "%s declares an unrestricted parent policy",
    (_, definition) => {
      expect(definition).toHaveProperty("allowedParents", undefined);
    },
  );

  it.each(
    Object.entries(definitions).filter(
      ([name]) => name !== "layoutCatalogDefinition",
    ),
  )("%s is an editor leaf with no child drop slots", (_, definition) => {
    expect(definition.allowedChildren).toEqual([]);
    expect(definition.slots).toEqual([]);
  });

  it("keeps the composition policies in the catalog used by the editor", () => {
    for (const [name, definition] of Object.entries(catalog.data.components)) {
      expect(definition.allowedParents).toBeUndefined();
      expect(definition.allowedChildren).toEqual(
        name === "Layout" ? undefined : [],
      );
      expect(definition.slots).toEqual(
        name === "Layout"
          ? ["default", "column2", "column3", "column4", "column5", "column6"]
          : [],
      );
    }
    expect(Object.keys(definitions)).toHaveLength(
      catalog.componentNames.length,
    );
  });
});
