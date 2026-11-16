/**
 * Preset Tailwind — Le Cercle
 * S'appuie sur les tokens CSS de packages/ui/tokens.css.
 * Usage :  presets: [require('@lecercle/ui/tailwind-preset')]
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand)',
          hover: 'var(--brand-hover)',
          text: 'var(--brand-text)',
          bright: 'var(--brand-bright)',
          tint: 'var(--brand-tint)',
        },
        indicator: 'var(--indicator)',
        onbrand: 'var(--on-brand)',
        bg: {
          DEFAULT: 'var(--bg)',
          deep: 'var(--bg-deep)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        border: {
          DEFAULT: 'var(--border)',
          soft: 'var(--border-soft)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        info: 'var(--info)',
        whatsapp: 'var(--whatsapp)',
      },
      fontFamily: {
        sans: ['Figtree', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        arabic: ['Cairo', 'Figtree', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.4' }],
        sm: ['13px', { lineHeight: '1.45' }],
        base: ['14px', { lineHeight: '1.45' }],
        md: ['16px', { lineHeight: '1.45' }],
        lg: ['18px', { lineHeight: '1.35' }],
        xl: ['22px', { lineHeight: '1.3' }],
        '2xl': ['30px', { lineHeight: '1.15' }],
      },
      spacing: {
        0.5: '2px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
      },
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
      },
      backgroundImage: {
        'brand-grad': 'var(--brand-grad)',
      },
      borderRadius: {
        none: '0',
        DEFAULT: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        full: '0',
      },
    },
  },
  plugins: [],
};
