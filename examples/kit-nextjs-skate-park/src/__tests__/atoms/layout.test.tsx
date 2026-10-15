import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { catalog, registry } from "@/atoms";
import { Layout } from "@/components/atoms/layout/layout";
import { layoutCatalogDefinition } from "@/components/atoms/layout/layout.schema";
import { Heading } from "@/components/atoms/heading/heading";
import { Button } from "@/components/atoms/button/button";

jest.mock("@sitecore-feaas/clientside/react", () => ({}));

describe("Layout Atom", () => {
  it("passes editor props and children through the registered renderer", () => {
    const RegisteredLayout = registry.registry.Layout;
    const { container } = render(
      <RegisteredLayout
        element={{
          type: "Layout",
          props: { direction: "horizontal", gap: "large", padding: "none" },
          children: [],
        }}
        emit={jest.fn()}
        on={() => ({
          shouldPreventDefault: false,
          bound: false,
          emit: jest.fn(),
        })}
      >
        <Heading text="Registered child" />
      </RegisteredLayout>,
    );
    expect(container.querySelector('[data-slot="layout"]')).toHaveClass(
      "flex-row",
      "gap-8",
      "p-0",
    );
    expect(
      screen.getByRole("heading", { name: "Registered child" }),
    ).toBeInTheDocument();
  });

  it("validates an authored document with nested Layouts and child Atoms", () => {
    const result = catalog.validate({
      root: "container",
      elements: {
        container: {
          type: "Layout",
          props: { direction: "vertical", gap: "medium", padding: "medium" },
          children: ["row"],
        },
        row: {
          type: "Layout",
          props: { direction: "horizontal", gap: "small", padding: "none" },
          children: ["heading"],
        },
        heading: {
          type: "Heading",
          props: { text: { value: "Nested heading" } },
          children: [],
        },
      },
    });
    expect(result.success).toBe(true);
  });

  it("exposes a default drop slot without restricting child or parent types", () => {
    expect(layoutCatalogDefinition.slots).toEqual(["default"]);
    expect(layoutCatalogDefinition.allowedChildren).toBeUndefined();
    expect(layoutCatalogDefinition.allowedParents).toBeUndefined();
    expect(registry.registry.Layout).toBeDefined();
  });

  it("uses the same defaults in the component and editor schema", () => {
    expect(layoutCatalogDefinition.props.parse({})).toEqual({
      direction: "vertical",
      gap: "medium",
      padding: "medium",
    });
    render(<Layout data-testid="layout" />);
    expect(screen.getByTestId("layout")).toHaveClass(
      "flex",
      "flex-col",
      "gap-4",
      "p-4",
      "min-h-12",
    );
    expect(screen.getByTestId("layout")).toBeEmptyDOMElement();
  });

  it("renders nested containers and interactive children in authored order", () => {
    const { container } = render(
      <Layout data-testid="outer">
        <Heading text="Title" />
        <Layout
          direction="horizontal"
          gap="small"
          padding="none"
          data-testid="inner"
        >
          <Button>Continue</Button>
        </Layout>
      </Layout>,
    );
    expect(screen.getByTestId("outer")).toContainElement(
      screen.getByRole("heading"),
    );
    expect(screen.getByTestId("inner")).toContainElement(
      screen.getByRole("button"),
    );
    expect(screen.getByTestId("inner")).toHaveClass(
      "flex-row",
      "flex-wrap",
      "gap-2",
      "p-0",
    );
    expect(
      container.querySelector('[data-slot="layout"]')?.firstElementChild
        ?.tagName,
    ).toBe("H1");
  });

  it.each([
    ["none", "gap-0", "p-0"],
    ["small", "gap-2", "p-2"],
    ["medium", "gap-4", "p-4"],
    ["large", "gap-8", "p-8"],
  ] as const)(
    "renders the %s spacing choice",
    (spacing, gapClass, paddingClass) => {
      render(<Layout gap={spacing} padding={spacing} data-testid="layout" />);
      expect(screen.getByTestId("layout")).toHaveClass(gapClass, paddingClass);
    },
  );

  it("preserves DOM attributes and allows consumer styling overrides", () => {
    render(
      <Layout
        id="custom"
        aria-label="Content"
        className="gap-8 p-0"
        data-testid="layout"
      />,
    );
    expect(screen.getByTestId("layout")).toHaveAttribute("id", "custom");
    expect(screen.getByTestId("layout")).toHaveAttribute(
      "aria-label",
      "Content",
    );
    expect(screen.getByTestId("layout")).toHaveClass("gap-8", "p-0");
    expect(screen.getByTestId("layout")).not.toHaveClass("gap-4", "p-4");
  });

  it.each([{ direction: "diagonal" }, { gap: "huge" }, { padding: -1 }])(
    "rejects unsupported editor configuration %j",
    (props) => {
      expect(layoutCatalogDefinition.props.safeParse(props).success).toBe(
        false,
      );
    },
  );
});
