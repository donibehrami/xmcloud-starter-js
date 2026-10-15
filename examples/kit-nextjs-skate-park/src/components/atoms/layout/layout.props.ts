import type { HTMLAttributes } from "react";
import type { z } from "zod";
import type { layoutCatalogDefinition } from "./layout.schema";

export type LayoutProps = HTMLAttributes<HTMLDivElement> &
  Partial<z.infer<typeof layoutCatalogDefinition.props>>;
