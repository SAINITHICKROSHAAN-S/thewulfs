// tailwind.config.js

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // --- 1. GLOBAL SPACING (8px Grid Foundation) ---
    // Extends default spacing for consistent design
    spacing: {
      ...defaultTheme.spacing,
      'xs': '0.25rem', // 4px
      'sm': '0.5rem', // 8px
      'md': '1rem',   // 16px
      'lg': '1.5rem', // 24px
      'xl': '2rem',   // 32px
      '2xl': '3rem',  // 48px
      '3xl': '4rem',  // 64px
    },
    extend: {
  colors: {
    primary: 'hsl(var(--color-primary) / <alpha-value>)',
    secondary: 'hsl(var(--color-secondary) / <alpha-value>)',
    accent: 'hsl(var(--color-accent) / <alpha-value>)',
    background: 'hsl(var(--background) / <alpha-value>)',
    foreground: 'hsl(var(--foreground) / <alpha-value>)',

    black: 'hsl(var(--color-black) / <alpha-value>)',
    white: 'hsl(var(--color-white) / <alpha-value>)',

    'gray-400': 'hsl(var(--gray-400) / <alpha-value>)',
    'gray-500': 'hsl(var(--gray-500) / <alpha-value>)',
    'gray-700': 'hsl(var(--gray-700) / <alpha-value>)',
    'gray-800': 'hsl(var(--gray-800) / <alpha-value>)',

    card: {
      DEFAULT: 'hsl(var(--card-bg) / <alpha-value>)',
      border: 'hsl(var(--card-border) / <alpha-value>)',
    },
  },


      // --- 3. CUSTOM TYPOGRAPHY MAPPING ---
      fontFamily: {
        // Define premium font hierarchy
        heading: ['var(--font-heading)', ...defaultTheme.fontFamily.sans],
        body: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
        detail: ['var(--font-detail)', ...defaultTheme.fontFamily.sans],
        
        // Map old font names to new semantic ones for easy global replacement:
        anton: ['var(--font-heading)', ...defaultTheme.fontFamily.sans],
        oswald: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
        inter: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
        montserrat: ['var(--font-detail)', ...defaultTheme.fontFamily.sans],
        sans: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
      },
      // --- 4. GLOBAL RADIUS / SHADOW STANDARDS ---
      borderRadius: {
        'lg': 'var(--radius-lg)',  // 0.75rem (rounded-xl)
        'md': 'var(--radius-sm)',  // 0.5rem (rounded-lg)
        'xl': 'var(--radius-lg)',
      },
      boxShadow: {
        'elevate': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}