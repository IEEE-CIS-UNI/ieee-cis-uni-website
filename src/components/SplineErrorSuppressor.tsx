"use client";

import { useEffect } from "react";

// Suppresses runtime errors thrown by @splinetool/runtime (Three.js scene loading).
// These are non-fatal internal errors from the 3D engine that don't affect the UI.
export default function SplineErrorSuppressor() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const msg = event.message ?? "";
      const file = event.filename ?? "";
      if (
        file.includes("splinetool") ||
        file.includes("@spline") ||
        (msg.includes("position") && file.includes("runtime")) ||
        msg.includes("Missing property") ||
        msg.includes("buildTimeline")
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason ?? "");
      if (reason.includes("splinetool") || reason.includes("Missing property")) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleError, true);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
