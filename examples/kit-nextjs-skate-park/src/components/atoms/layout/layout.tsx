import { cn } from "@/lib/atoms-utils";
import { Children } from "react";
import type { LayoutProps } from "./layout.props";

const gapClasses = {
  none: "gap-0",
  small: "gap-2",
  medium: "gap-4",
  large: "gap-8",
};

const paddingClasses = {
  none: "p-0",
  small: "p-2",
  medium: "p-4",
  large: "p-8",
};

const columnClasses: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

export function Layout({
  columns,
  slots,
  direction = "vertical",
  gap = "medium",
  padding = "medium",
  className,
  children,
  ...rest
}: LayoutProps) {
  const content = [
    children,
    slots?.column2,
    slots?.column3,
    slots?.column4,
    slots?.column5,
    slots?.column6,
  ];
  const lastPopulated = content.reduce<number>(
    (last, node, index) =>
      Children.toArray(node).length > 0 ? index + 1 : last,
    0,
  );
  const useColumns = columns !== undefined || lastPopulated > 1;
  const columnCount = columns ?? 1;

  return (
    <div
      {...rest}
      data-slot="layout"
      className={cn(
        // Keep an empty container large enough to target in the editor.
        "min-h-12 min-w-0 w-full",
        useColumns
          ? cn("grid grid-cols-1", columnClasses[columnCount])
          : cn(
              "flex",
              direction === "horizontal" ? "flex-row flex-wrap" : "flex-col",
            ),
        gapClasses[gap],
        paddingClasses[padding],
        className,
      )}
    >
      {useColumns
        ? content
            .slice(0, Math.max(columnCount, lastPopulated))
            .map((node, index) => (
              <div
                key={index}
                data-layout-slot={
                  index === 0 ? "default" : `column${index + 1}`
                }
                className="flex min-h-12 min-w-0 flex-col"
              >
                {node}
              </div>
            ))
        : children}
    </div>
  );
}
