module.exports = {
theme: {
  extend: {
    keyframes: {
      blink: {
        '0%, 50%, 100%': { opacity: 1 },
        '25%, 75%': { opacity: 0 },
      },
    },
    animation: {
      blink: 'blink 1s step-start infinite',
    },
  },
},
}