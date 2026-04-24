import { useTranslation } from 'react-i18next'

const HeroIllustration = () => {
  const { t } = useTranslation()

  return (
  <svg
    viewBox="0 0 500 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: 'auto', maxWidth: 480 }}
  >
    {/* Background card - quiz card */}
    <rect x="100" y="40" width="300" height="320" rx="24" fill="#EEF2FF" />
    <rect x="100" y="40" width="300" height="320" rx="24" stroke="#C7D2FE" strokeWidth="2" />

    {/* Question header bar */}
    <rect x="100" y="40" width="300" height="60" rx="24" fill="#4F46E5" />
    <rect x="100" y="76" width="300" height="24" fill="#4F46E5" />
    <text
      x="250"
      y="78"
      textAnchor="middle"
      fill="#fff"
      fontFamily="Inter, sans-serif"
      fontSize="16"
      fontWeight="700"
    >
      {t('home.heroQuestionProgress')}
    </text>

    {/* Timer circle */}
    <circle cx="370" cy="65" r="18" fill="rgba(255,255,255,0.2)" />
    <text
      x="370"
      y="70"
      textAnchor="middle"
      fill="#fff"
      fontFamily="Inter, sans-serif"
      fontSize="14"
      fontWeight="700"
    >
      12
    </text>

    {/* Question text */}
    <rect x="130" y="120" width="240" height="12" rx="6" fill="#94A3B8" />
    <rect x="150" y="140" width="200" height="12" rx="6" fill="#CBD5E1" />

    {/* Choice A - selected/correct */}
    <rect x="130" y="175" width="240" height="44" rx="10" fill="#4F46E5" />
    <circle cx="155" cy="197" r="12" fill="rgba(255,255,255,0.25)" />
    <text
      x="155"
      y="202"
      textAnchor="middle"
      fill="#fff"
      fontFamily="Inter, sans-serif"
      fontSize="11"
      fontWeight="700"
    >
      A
    </text>
    <rect x="178" y="191" width="140" height="12" rx="6" fill="rgba(255,255,255,0.7)" />

    {/* Choice B */}
    <rect
      x="130"
      y="228"
      width="240"
      height="44"
      rx="10"
      fill="#fff"
      stroke="#E2E8F0"
      strokeWidth="1.5"
    />
    <circle cx="155" cy="250" r="12" fill="#EEF2FF" />
    <text
      x="155"
      y="255"
      textAnchor="middle"
      fill="#4F46E5"
      fontFamily="Inter, sans-serif"
      fontSize="11"
      fontWeight="700"
    >
      B
    </text>
    <rect x="178" y="244" width="120" height="12" rx="6" fill="#E2E8F0" />

    {/* Choice C */}
    <rect
      x="130"
      y="281"
      width="240"
      height="44"
      rx="10"
      fill="#fff"
      stroke="#E2E8F0"
      strokeWidth="1.5"
    />
    <circle cx="155" cy="303" r="12" fill="#EEF2FF" />
    <text
      x="155"
      y="308"
      textAnchor="middle"
      fill="#4F46E5"
      fontFamily="Inter, sans-serif"
      fontSize="11"
      fontWeight="700"
    >
      C
    </text>
    <rect x="178" y="297" width="150" height="12" rx="6" fill="#E2E8F0" />

    {/* Decorative elements */}
    {/* Floating checkmark badge */}
    <circle cx="420" cy="160" r="28" fill="#10B981" />
    <path
      d="M408 160 L416 168 L432 152"
      stroke="#fff"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Small floating stars/sparkles */}
    <circle cx="75" cy="100" r="6" fill="#FCD34D" opacity="0.7" />
    <circle cx="440" cy="280" r="5" fill="#818CF8" opacity="0.6" />
    <circle cx="60" cy="250" r="4" fill="#818CF8" opacity="0.5" />
    <circle cx="450" cy="100" r="3.5" fill="#FCD34D" opacity="0.5" />

    {/* Score ring mini */}
    <g transform="translate(70, 300)">
      <circle cx="20" cy="20" r="18" fill="none" stroke="#E2E8F0" strokeWidth="3" />
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke="#10B981"
        strokeWidth="3"
        strokeDasharray="84.82"
        strokeDashoffset="25.45"
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
      />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fill="#10B981"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        fontWeight="800"
      >
        7
      </text>
    </g>

    {/* Progress dots */}
    <g transform="translate(195, 340)">
      <circle cx="0" cy="0" r="4" fill="#4F46E5" />
      <circle cx="14" cy="0" r="4" fill="#4F46E5" />
      <circle cx="28" cy="0" r="4" fill="#4F46E5" opacity="0.3" />
      <circle cx="42" cy="0" r="4" fill="#4F46E5" opacity="0.3" />
      <circle cx="56" cy="0" r="4" fill="#4F46E5" opacity="0.3" />
      <circle cx="70" cy="0" r="4" fill="#4F46E5" opacity="0.3" />
      <circle cx="84" cy="0" r="4" fill="#4F46E5" opacity="0.3" />
      <circle cx="98" cy="0" r="4" fill="#4F46E5" opacity="0.3" />
      <circle cx="112" cy="0" r="4" fill="#4F46E5" opacity="0.3" />
    </g>
  </svg>
  )
}

export default HeroIllustration
