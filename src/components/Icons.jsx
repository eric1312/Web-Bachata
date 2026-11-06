// Íconos simples de trazo (heredan el color con currentColor)
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const WhatsAppIcon = ({ size = 26 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M3 21l1.7-5A9 9 0 1 1 8 19.3L3 21Z" />
    <path d="M9 8.5c0 3.500 3 6.500 6.500 6.500l1-1.500-2-1-.8.800a4 4 0 0 1-2-2l.8-.8-1-2L9 8.500Z" />
  </svg>
)

export const InstagramIcon = ({ size = 26 }) => (
  <svg {...base} width={size} height={size}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.500" cy="6.500" r="0.600" fill="currentColor" />
  </svg>
)

export const MailIcon = ({ size = 26 }) => (
  <svg {...base} width={size} height={size}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const PhoneIcon = ({ size = 26 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
)

export const SpotifyIcon = ({ size = 24 }) => (
  <svg {...base} width={size} height={size}>
    <circle cx="12" cy="12" r="10" />
    <path d="M7 9.200c3.500-1 7-.7 10 1.100" />
    <path d="M7.500 12.500c3-.8 6-.5 8.500 1" />
    <path d="M8 15.500c2.500-.6 5-.4 7 .8" />
  </svg>
)

export const CameraIcon = ({ size = 20 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M4 8h3l1.500-2.500h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="3.500" />
  </svg>
)

export const CloseIcon = ({ size = 24 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

/** Flecha de navegación. direction: 'left' | 'right' */
export const ChevronIcon = ({ size = 28, direction = 'right' }) => (
  <svg {...base} width={size} height={size}>
    <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
)

export const ArrowIcon = ({ size = 18 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
