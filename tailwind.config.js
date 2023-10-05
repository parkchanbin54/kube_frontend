// module.exports = {
//   purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
//   darkMode: false, // or 'media' or 'class'
//   theme: {
//     extend: {},
//   },
//   variants: {
//     extend: {},
//   },
//   plugins: [],
// }
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  
  colors: {
    'cfsummergreen': '#009B9B',
    'cflightgreen': '#6cdeb5'
  },

  theme: {
    extend: {
      zIndex: {
        '99' : "99",
      },
      keyframes: {
        modalBgShow: {
          from: {opacity: "0"},
          to: {opacity: "1"}
        },
        modalShow: {
          from: {opacity: "0", marginTop: "-50px"},
          to: {opacity: "1", marginTop: "0"}
        },
      },
      animation: {
        modalBgShow: "modalBgShow 0.3s ease-in-out",
        modalShow:"modalShow 0.3s ease-in-out"
      }
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar-hide')
  ],
}