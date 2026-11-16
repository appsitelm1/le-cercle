export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-label="le cercle"
    >
      <g transform="translate(1 0)">
        <path d="M30.72 15 A14 14 0 1 0 30.72 33" stroke="currentColor" strokeWidth="4" />
        <path d="M14 24 H40" stroke="var(--text)" strokeWidth="4" />
        <path d="M40 15 V33" stroke="var(--text)" strokeWidth="4" />
      </g>
    </svg>
  );
}
