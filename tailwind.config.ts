import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import fluid, { extract, screens } from "fluid-tailwind";

const config: Config = {
  content: {
    files: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    extract,
  },
  theme: {
    screens,
    extend: {
      colors: {
        main: "#E1D1C5",
        mainAccent: "#C6AFA0",
        overlay: "rgba(0,0,0,0.5)",

        background: "#f8f9fa",
        foreground: "#343a40",
        destructive: "#dc2626",
        "destructive-foreground": "#ffffff",

        darkBg: "#343a40",
        darkText: "#f8f9fa",
        darkBorder: "#495057",
        secondaryBlack: "#212529",
      },
      borderRadius: {
        base: "5px",
      },
      boxShadow: {
        light: "4px 4px 0px 0px #000",
        dark: "4px 4px 0px 0px #000",
      },
      translate: {
        boxShadowX: "4px",
        boxShadowY: "4px",
        reverseBoxShadowX: "-4px",
        reverseBoxShadowY: "-4px",
      },
      fontWeight: {
        base: "500",
        heading: "700",
      },
      fontFamily: {
        sans: "var(--font-geist-sans)",
        mono: "var(--font-geist-mono)",
      },
    },
  },
  plugins: [animate, fluid],
};
export default config;
