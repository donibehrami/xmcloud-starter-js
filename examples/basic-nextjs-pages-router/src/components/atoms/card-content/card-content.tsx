import type * as React from "react";

import { cn } from "@/lib/atoms-utils";

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div
      {...props}
      data-slot="card-content"
      className={cn("p-6", className)}
    >
      {children}
    </div>
  );
}

export { CardContent };
