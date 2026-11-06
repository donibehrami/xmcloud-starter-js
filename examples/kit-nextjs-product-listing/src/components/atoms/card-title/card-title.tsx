import type * as React from "react";

import { cn } from "@/lib/atoms-utils";

export type CardTitleProps = React.HTMLAttributes<HTMLDivElement> & {
  text?: string;
};

function CardTitle({ className, text, ...props }: CardTitleProps) {
  return (
    <div
      {...props}
      data-slot="card-title"
      className={cn(
        "px-6 pt-6 text-lg font-semibold leading-none tracking-tight",
        className,
      )}
    >
      { text}
    </div>
  );
}

export { CardTitle };
