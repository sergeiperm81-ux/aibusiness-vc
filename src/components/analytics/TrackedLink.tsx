"use client";

import Link, { type LinkProps } from "next/link";
import { trackEvent, type AnalyticsParams } from "@/lib/analytics";
import type { MouseEventHandler, ReactNode } from "react";

interface TrackedLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  eventName: string;
  eventParams?: AnalyticsParams;
  target?: string;
  rel?: string;
}

export function TrackedLink({
  children,
  className,
  eventName,
  eventParams = {},
  onClick,
  ...props
}: TrackedLinkProps & {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      {...props}
      className={className}
      onClick={(event) => {
        trackEvent(eventName, eventParams);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
