import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  // Global ignores
  {
    ignores: [".next/**", "out/**", "node_modules/**"],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // React and Next.js
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Disable rules that conflict with Next.js
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
];
