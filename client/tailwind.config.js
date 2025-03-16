const config = {
  content: ['./src/app/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        'dark-bg': '#101214',
        'dark-secondary': '#1d1f21',
        'dark-tertiary': '#3b3d40',
        'stroke-dark': '#2d3135',
      },
    },
  },
  plugins: [],
};
export default config;
