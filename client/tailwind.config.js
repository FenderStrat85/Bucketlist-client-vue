/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['index.html', './src/**/*.{vue,js}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      purple: '#472183',
      darkBlue: '#4B56D2',
      lightBlue: '#82C3EC',
      grey: '#F1F6F5',
      turquoise: '#439A97',
      teal: '#62B6B7',
      lightGreen: '#97DECE',
      forrestGreen: '#CBEDD5',
      delete: '#EB455F',
      deleteHover: '#FF597B'
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
