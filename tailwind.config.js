/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      scale: {
        '200': '2', 
        '250': '2.5'
      },
      colors: {
        primary: {
          DEFAULT: 'var(--heading-color)',
        },
        text: {
          DEFAULT: 'var(--text-color)',
        },
        background: {
          DEFAULT: 'var(--background-color)',
          card: 'var(--card-background)',
        },
        border: {
          DEFAULT: 'var(--border-color)',
        },
      },
    },
  },
  plugins: [],
};
