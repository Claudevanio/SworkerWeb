import type { Config } from "tailwindcss";
interface ColorPalette {
  primary: {
    [key: string]: string;
    default: string;
  };
  base: {
    [key: string]: string;
  };
  secondary: string;
  sidebarHighlight: string;
  danger: string;
  erro: {
    [key: string]: string;
  };
  sucesso: {
    [key: string]: string;
  };
  success: string;
  warning: {
    [key: string]: string;
  };
  info: string;
  highlight: string;
  dark: string;
  gray: {
    [key: string]: string;
  };
}

const COLORSENV: ColorPalette = JSON.parse(process.env.NEXT_PUBLIC_COLORS);

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        ...COLORSENV,
      },
    },
  },
  plugins: [],
};
export default config;
