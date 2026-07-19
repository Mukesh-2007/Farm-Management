/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — deep pine/forest green. Cools toward blue-green as it
        // darkens (like conifer needles in shadow) instead of a flat single-hue ramp.
        forest: {
          50: '#f1f6f1',
          100: '#dfebdd',
          200: '#bfd6bb',
          300: '#98bb92',
          400: '#6e9b68',
          500: '#4d7c49',
          600: '#386238',
          700: '#2c4e2e',
          800: '#1f3b23',
          900: '#142a19',
          950: '#0a1810',
        },
        // Secondary / accent — burnished antique gold. Used sparingly:
        // CTAs, active nav states, key stat highlights. Never a fill color.
        gold: {
          50: '#fbf6e9',
          100: '#f5e9c8',
          200: '#ead08d',
          300: '#dfb662',
          400: '#cc9a3e',
          500: '#b07f2a',
          600: '#8f6320',
          700: '#714e1c',
          800: '#573d19',
          900: '#402d14',
          950: '#241809',
        },
        // Neutral — warm parchment/stone instead of a cold blue-gray.
        // Backgrounds, cards, borders, body text all live here.
        parchment: {
          50: '#fdfcfa',
          100: '#f8f5f0',
          200: '#efeae1',
          300: '#e1d9cb',
          400: '#c9bea9',
          500: '#a99c84',
          600: '#857761',
          700: '#665a48',
          800: '#4a4136',
          900: '#322c25',
          950: '#1c1815',
        },
        // Semantic — danger (outbreaks, expired stock, critical alerts)
        rust: {
          50: '#fbefea',
          100: '#f5d6c8',
          200: '#e8ad91',
          300: '#d8825e',
          400: '#c15e3a',
          500: '#a6432a',
          600: '#8a3221',
          700: '#6e2519',
          800: '#521b12',
          900: '#38130d',
          950: '#200a07',
        },
        // Semantic — warning (low stock, upcoming due dates)
        ochre: {
          50: '#fdf6e8',
          100: '#fae8c0',
          200: '#f3cd7c',
          300: '#e8ae49',
          400: '#d6912b',
          500: '#b8751f',
          600: '#955d1a',
          700: '#744818',
          800: '#573716',
          900: '#3d2711',
          950: '#221507',
        },
        // Semantic — info (neutral notices, tips, read-only banners)
        mist: {
          50: '#f1f5f6',
          100: '#dfe7ea',
          200: '#c0d1d7',
          300: '#98b3bc',
          400: '#6d909d',
          500: '#4e7382',
          600: '#3b5a67',
          700: '#2f4650',
          800: '#24363d',
          900: '#1a272c',
          950: '#0f1619',
        },
        // Semantic — success reuses forest, kept as an explicit alias
        // so success states read intentionally rather than "reused primary".
        success: {
          50: '#f1f6f1',
          400: '#6e9b68',
          500: '#4d7c49',
          600: '#386238',
          700: '#2c4e2e',
        },
      },
      fontFamily: {
        // Body copy, UI chrome, forms, tables
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Page titles, section headers, dashboard hero numbers
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        // Stat figures, IDs, timestamps, tabular/ledger data
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Slightly wider tracking eyebrow/label size used across the app
        eyebrow: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
      },
      boxShadow: {
        // Warm-tinted shadows (forest-950 tint instead of pure black)
        // so elevation reads as "premium" rather than generic gray SaaS.
        card: '0 1px 2px 0 rgba(10, 24, 16, 0.06), 0 1px 3px 0 rgba(10, 24, 16, 0.08)',
        panel: '0 4px 10px -2px rgba(10, 24, 16, 0.10), 0 2px 4px -2px rgba(10, 24, 16, 0.08)',
        raised: '0 12px 24px -6px rgba(10, 24, 16, 0.16), 0 4px 8px -4px rgba(10, 24, 16, 0.10)',
        gold: '0 6px 16px -4px rgba(176, 127, 42, 0.35)',
      },
      borderRadius: {
        xl2: '1rem',
      },
      backgroundImage: {
        // Subtle diagonal sheen used behind the header / hero stat band
        'forest-sheen': 'linear-gradient(135deg, #142a19 0%, #1f3b23 55%, #2c4e2e 100%)',
      },
    },
  },
  plugins: [],
}
