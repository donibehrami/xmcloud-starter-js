import type * as React from "react";

import { cn } from "@/lib/atoms-utils";

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      {...props}
      data-slot="card-footer"
      className={cn("flex items-center gap-2 px-6 pb-6", className)}
    >
      {children}
    </div>
  );
}

export { CardFooter };
