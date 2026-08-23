import type { ReactNode } from "react";

const P: Record<string, ReactNode> = {
  org: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V8l7-5 7 5v13" />
      <path d="M9 21v-4h6v4" />
      <path d="M9.5 9.5h.01M12 9.5h.01M14.5 9.5h.01M9.5 12.5h.01M12 12.5h.01M14.5 12.5h.01" />
    </>
  ),
  metrics: (
    <>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15l3.5-3.5" />
      <path d="M2.5 19h19" />
      <path d="M12 15h.01" />
    </>
  ),
  finance: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 16.5V8h3.2a2.6 2.6 0 1 1 0 5.2H9.5" />
      <path d="M9.5 15.5H14" />
    </>
  ),
  programs: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13.5 9 5 9-5" />
      <path d="m3 17.5 9 5 9-5" opacity="0.45" />
    </>
  ),
  photos: (
    <>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l2-3h6l2 3h2.5A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-10Z" />
      <circle cx="12" cy="13" r="3.6" />
    </>
  ),
  file: (
    <>
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 13h5M9.5 16.5h5" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 17v2.5a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V17" />
    </>
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  trash: (
    <>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V4.5h5V7" />
      <path d="m6.5 7 1 13.5h9L17.5 7" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  check: <path d="m5 13 4.2 4.2L19 7.4" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19L12 3.5Z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.5h.01" />
    </>
  ),
  arrowR: (
    <>
      <path d="M5 12h14" />
      <path d="m13.5 6.5 5.5 5.5-5.5 5.5" />
    </>
  ),
  arrowL: (
    <>
      <path d="M19 12H5" />
      <path d="m10.5 6.5-5.5 5.5 5.5 5.5" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15.5v-11" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M4.5 17v2.5a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V17" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
      <path d="M3.5 16.5 8.5 11.5l4 4 3-3 5 4.5" />
      <path d="M9 9.5h.01" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 1.7 4.6L18.5 9.3l-4.8 1.7L12 15.8l-1.7-4.8-4.8-1.7 4.8-1.7L12 3Z" />
      <path d="m18.8 15.5.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
    </>
  ),
  reset: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 3.5v5h5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.6" />
      <path d="M2.8 20.5v-.7a6.2 6.2 0 0 1 12.4 0v.7" />
      <path d="M15.5 4.7a3.6 3.6 0 0 1 0 6.6" />
      <path d="M17.8 14.6a6.2 6.2 0 0 1 3.4 5.2v.7" />
    </>
  ),
  heart: (
    <path d="M12 20.5S3.5 15 3.5 9.4A4.4 4.4 0 0 1 8 5c1.7 0 3.2.9 4 2.2A4.7 4.7 0 0 1 16 5a4.4 4.4 0 0 1 4.5 4.4c0 5.6-8.5 11.1-8.5 11.1Z" />
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </>
  ),
  phone: (
    <path d="M5.5 4h3.6l1.5 4.2-2.2 1.6a12.5 12.5 0 0 0 5.8 5.8l1.6-2.2L20 14.9v3.6a1.9 1.9 0 0 1-2 1.9A15.9 15.9 0 0 1 3.6 6a1.9 1.9 0 0 1 1.9-2Z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5a13.6 13.6 0 0 1 0 17 13.6 13.6 0 0 1 0-17Z" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <path d="M12 7.8h.01" />
    </>
  ),
  bank: (
    <>
      <path d="m3 9.5 9-5.5 9 5.5" />
      <path d="M5 10v8M9.7 10v8M14.3 10v8M19 10v8" />
      <path d="M3.5 20.5h17" />
    </>
  ),
  pen: <path d="m4.5 19.5 1-4L17 4l3 3-11.5 11.5-4 1Z" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v4M16 3v4" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12.5 9 5 9-5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-10.4a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.4" r="2.3" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.7,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {P[name] ?? P.info}
    </svg>
  );
}

/** Фирменный знак приложения. */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="4" y="4" width="32" height="32" rx="8" fill="#0F453C" />
      <path
        d="M12 27V13.5h9.5a4.5 4.5 0 1 1 0 9H12"
        fill="none"
        stroke="#EEBC62"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 27h14" stroke="#7FBAAB" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
