import type { ReactNode } from 'react';

const ICONS: Record<string, ReactNode> = {
  house: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </>
  ),
  housePlus: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M12 11.5v5" />
      <path d="M9.5 14h5" />
    </>
  ),
  home2: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  key: (
    <>
      <circle cx="7.5" cy="15.5" r="4" />
      <path d="M10.6 12.4 21 2" />
      <path d="M16 7l2 2" />
      <path d="M13 10l2 2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-3.9 3.6-6 8-6s8 2.1 8 6" />
    </>
  ),
  usercheck: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M3 21c0-3.9 2.7-6 6-6s6 2.1 6 6" />
      <path d="m15.5 11 2 2 4-4" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16" />
      <path d="M17 9h3a1 1 0 0 1 1 1v11" />
      <path d="M2 21h20" />
      <path d="M8 7h2M8 11h2M8 15h2M12 7h2M12 11h2M12 15h2" />
    </>
  ),
  building2: (
    <>
      <rect x="4" y="3" width="16" height="18" />
      <path d="M9 21v-4h6v4" />
      <path d="M8 7h2M8 11h2M14 7h2M14 11h2" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-8.8-8.6C2 8 4 4.5 7.2 4.5c1.9 0 3.4.9 4.8 2.9C13.4 5.4 14.9 4.5 16.8 4.5 20 4.5 22 8 20.8 11.4 19 15.6 12 20 12 20Z" />
  ),
  plus: (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  login: (
    <>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="m10 17 5-5-5-5" />
      <path d="M15 12H3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  bed: (
    <>
      <path d="M2 19V9" />
      <path d="M2 19h20v-4" />
      <path d="M3 9h18v6H3" />
      <path d="M6 9V5h12v4" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8Z" />,
  pin: (
    <>
      <path d="M12 21s-7-5.4-7-11a7 7 0 0 1 14 0c0 5.6-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  chat: <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.6A8.5 8.5 0 1 1 21 11.5Z" />,
  aleft: (
    <>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </>
  ),
  aright: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="m8.5 13-1.5 9 5-3 5 3-1.5-9" />
    </>
  ),
  shield: <path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6Z" />,
  store: (
    <>
      <path d="M4 9l1-4h14l1 4" />
      <path d="M4 9v11h16V9" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </>
  ),
  land: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10l5 3 4-6 5 7v7" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  chart: <path d="M4 20V12M9 20V6M14 20v-8M19 20V4M4 20h16" />,
  activity: <path d="M3 12h4l2-7 4 14 2-7h6" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 14.5c2.8.3 5 2.1 5 5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  edit: <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />,
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13h10l1-13" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" />
      <path d="M5 15V5a1 1 0 0 1 1-1h10" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pause: <path d="M8 5v14M16 5v14" />,
  check: <path d="m4 12 5 5L20 6" />,
  ban: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  riad: (
    <>
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M3 21h18" />
      <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
      <path d="M12 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </>
  ),
  farm: (
    <>
      <path d="M4 21V10l6-4 6 4" />
      <path d="M4 21h16" />
      <path d="M9 21v-6h6v6" />
      <path d="M10 12h4" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="0.8" />
    </>
  ),
  facebook: <path d="M14.5 8.5H17V5h-2.5A4 4 0 0 0 10.5 9v2H8v3h2.5v7H13v-7h2.6l.4-3H13V9a1 1 0 0 1 1.5-.5Z" />,
  tiktok: <path d="M14 4c.3 2 1.6 3.4 3.5 3.7M14 4v9.5a3.5 3.5 0 1 1-3-3.46M14 4a3.5 3.5 0 0 0 3.5 3.7" />,
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V16M8 7.5v.01M12 16v-3.5a2 2 0 0 1 4 0V16" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.01" />
    </>
  ),
  cottage: (
    <>
      <path d="M4 13 12 5l8 8" />
      <path d="M6 12v8h12v-8" />
      <path d="M10 20v-4h4v4" />
      <path d="M16 8v-3h2v5" />
      <path d="M8 12h8" />
    </>
  ),
  banknote: (
    <>
      <rect x="3" y="6" width="18" height="12" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9v.01M18 15v.01" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  className = '',
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      {ICONS[name] ?? null}
    </svg>
  );
}
