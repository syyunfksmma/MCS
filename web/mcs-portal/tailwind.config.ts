import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2F6FED',
          dark: '#1D4ED8'
        },
        secondary: '#22B8CF',
        accent: '#FACC15'
      }
    }
  },
  plugins: []
};

export default config;
