/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'muv-blue': {
          300: '#485BDD',
        },
        'button-primary-border': '#A3B3FF',
        'button-secondary': '#F0F2F5',
        'button-secondary-border': 'rgba(163, 179, 255, 0.5)',
      },
      fontFamily: {
        fredoka: ['Fredoka'],
      },
    },
  },
  plugins: [],
};
