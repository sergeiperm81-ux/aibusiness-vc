"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsParams } from "@/lib/analytics";

interface TrackEventOnViewProps {
  eventName: string;
  params?: AnalyticsParams;
}

export function TrackEventOnView({ eventName, params = {} }: TrackEventOnViewProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackEvent(eventName, params);
  }, [eventName, params]);

  return null;
}
