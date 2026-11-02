import assert from "node:assert/strict";
import { test } from "node:test";
import {
  containerBackgroundSchema,
  containerBorderSchema,
  containerCatalogDefinition,
} from "./container.schema";

test("Container does not expose defaults in the catalog schema", () => {
  const schema = containerCatalogDefinition.props.toJSONSchema();
  assert.doesNotMatch(JSON.stringify(schema), /"default"\s*:/);
});

test("Container leaves omitted colors unset and preserves explicit colors", () => {
  assert.deepEqual(containerBackgroundSchema.parse({}), {});
  assert.deepEqual(containerBorderSchema.parse({}), {});
  assert.deepEqual(containerBackgroundSchema.parse({ color: "transparent" }), {
    color: "transparent",
  });
  assert.deepEqual(containerBorderSchema.parse({ color: "#ff0000" }), {
    color: "#ff0000",
  });
});

test("Container keeps omitted backgrounds and borders optional", () => {
  assert.deepEqual(containerCatalogDefinition.props.parse({}), {});
  assert.deepEqual(
    containerCatalogDefinition.props.parse({ breakpoints: [{}] }),
    { breakpoints: [{}] },
  );
  assert.deepEqual(
    containerCatalogDefinition.props.parse({
      breakpoints: [{ background: {}, border: { width: "1px", style: "solid" } }],
    }),
    {
      breakpoints: [{ background: {}, border: { width: "1px", style: "solid" } }],
    },
  );
});

test("Container does not add background or border colors to its catalog example", () => {
  const example = containerCatalogDefinition.example;

  assert.deepEqual(containerCatalogDefinition.props.parse(example), example);
  assert.deepEqual(example.breakpoints[0], {
    columns: 2,
    gap: "1rem",
  });
});
