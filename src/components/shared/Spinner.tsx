import * as React from "react";

export function Spinner({className}: {className?: string}) {
  const base: React.CSSProperties = {
    animation: "spinner-fade 0.8s linear infinite",
    transformBox: "fill-box",
    transformOrigin: "center",
  };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle cx="6"  cy="6"  r="1" fill="currentColor" style={{ ...base, animationDelay: "-0.1s" }} />
      <circle cx="4"  cy="12" r="1" fill="currentColor" style={{ ...base, animationDelay: "-0.2s" }} />
      <circle cx="6"  cy="18" r="1" fill="currentColor" style={{ ...base, animationDelay: "-0.3s" }} />
      <circle cx="12" cy="20" r="1" fill="currentColor" style={{ ...base, animationDelay: "-0.4s" }} />
      <circle cx="18" cy="18" r="1" fill="currentColor" style={{ ...base, animationDelay: "-0.5s" }} />
      <circle cx="20" cy="12" r="1" fill="currentColor" style={{ ...base, animationDelay: "-0.6s" }} />
      <circle cx="18" cy="6"  r="1" fill="currentColor" style={{ ...base, animationDelay: "-0.7s" }} />
      <circle cx="12" cy="4"  r="1" fill="currentColor" style={{ ...base, animationDelay:    "0s" }} />
    </svg>
  );
}