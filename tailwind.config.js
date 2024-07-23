module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',  // Purple
        secondary: '#FFFFFF', // White
        golden: '#EDC042',   // Golden yellow
        'custom-gradient-start': '#FDE5C1',
        'custom-gradient-sm': '#F7DAB8',
        'custom-gradient-em': '#FFB169',
        'custom-gradient-end': '#FFB268',
         "progrerss-bar-start":"#FCA933",
         "progrerss-bar-end":"#FEE14F",
         'glass-bg': 'rgba(255, 255, 255, 0.3)',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
      boxShadow: {
        'custom': 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
      },
      borderColor: {
        'glass-border': 'rgba(255, 255, 255, 0.18)', // Slightly transparent border color
      },
      backgroundImage: {
        'level-gradient': 'linear-gradient(14.64deg, #FA650F 25%, rgba(252, 247, 189, 0.26) 59.35%)',
        'custom-gradient': 'linear-gradient(202.37deg, #600E8F 23.75%, #360A5A 52.09%, #181723 102.48%)',
        'custom-gradient-tapgame': 'linear-gradient(to bottom, #FDE5C1,#F7DAB8 ,#FFB169, #FFB268)',
        'sky': 'linear-gradient(0deg, rgba(255,134,134,1) 0%, rgba(2,233,242,1) 0%, rgba(44,127,247,1) 100%)',
        'progress-bar': 'linear-gradient(to right,#FCA933 ,#FEE14F)',
      },
      width: {
        '8/10': '80%',
      },
      fontFamily: {
        body: ['"Open Sans"', 'sans-serif'],
        display: ['"Permanent Marker"', 'cursive'],
      },
      keyframes: {
        'scale-up-down': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
      animation: {
        'scale-up-down': 'scale-up-down 2s infinite',
      },
    },
  },
  variants: {
    backdropFilter: ['responsive'],
  },
  plugins: [],
}
