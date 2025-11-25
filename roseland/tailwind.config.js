module.exports = {
  content: ["./*.html"], // scan all HTML files in root
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f8e9f0',
          100: '#f0d2e0',
          200: '#e1a5c2',
          300: '#d378a3',
          400: '#c54b85',
          500: '#913164', // main
          600: '#7b2955',
          700: '#662146',
          800: '#501937',
          900: '#3b1228',
        },
        secondary: {
          50:  '#e8edf5',
          100: '#d1dbeb',
          200: '#a3b6d7',
          300: '#7692c3',
          400: '#486daf',
          500: '#214177', // main
          600: '#1d396a',
          700: '#182f5a',
          800: '#13264b',
          900: '#0e1c3b',
        },
      },
    },
  },
  plugins: [],
};
