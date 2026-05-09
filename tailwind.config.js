module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem'
    },
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        primary: '#2563eb',
        secondary: '#0f766e',
        accent: '#f97316',
        muted: '#64748b',
        'brand-dark': '#0f172a'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      },
      spacing: {
        'xxs': '0.25rem',
        'xs': '0.5rem',
        'sm': '0.75rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem'
      },
      borderRadius: {
        sm: '0.375rem',
        lg: '1rem',
        xl: '1.5rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
