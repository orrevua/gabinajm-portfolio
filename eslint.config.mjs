import nextConfig from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    files: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    rules: {
      "no-console": "off",
    },
  },
];

export default eslintConfig;
