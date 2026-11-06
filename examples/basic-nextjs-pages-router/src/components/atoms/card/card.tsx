import type * as React from "react";

import { cn } from "@/lib/atoms-utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

function Card({ className, children, slots, ...props }: CardProps & { slots?: Record<string, React.ReactNode> } ) {
  return (
    <div
      {...props}
      data-slot="card"
      className={cn(
        "rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm min-w-12",
        className,
      )}
    >
      {slots?.title && (
        <div data-slot="title">
          {slots.title}
        </div>
      )}
      {slots?.content && (
        <div data-slot="content">
          {slots.content}
        </div>
      )}
      {slots?.footer && (
        <div data-slot="footer">
          {slots.footer}
        </div>
      )}
    </div>
  );
}

export { Card };
