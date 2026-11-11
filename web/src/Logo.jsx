// Logo Syvra Fitness : un haltère incliné dans un carré arrondi aux couleurs Syvra.
export default function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Syvra Fitness">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8e6cf" />
          <stop offset="1" stopColor="#75cbc4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-bg)" />
      <g transform="rotate(-35 16 16)" fill="#00274d">
        <rect x="10" y="14.8" width="12" height="2.4" rx="1.2" />
        <rect x="7" y="9" width="4" height="14" rx="1.6" />
        <rect x="21" y="9" width="4" height="14" rx="1.6" />
        <rect x="3.8" y="11.5" width="2.8" height="9" rx="1.2" />
        <rect x="25.4" y="11.5" width="2.8" height="9" rx="1.2" />
      </g>
    </svg>
  );
}
