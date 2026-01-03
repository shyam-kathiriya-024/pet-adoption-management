import eslintjs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const base = {
  name: "base",
  languageOptions: {
    parser: tseslint.parser,
    ecmaVersion: "latest",
    parserOptions: {
      project: ["./tsconfig.eslint.json"],
    },
    globals: { ...globals.es2024, ...globals.node },
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  rules: {
    eqeqeq: ["error", "always", { null: "ignore" }],
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "separate-type-imports" },
    ],
    "@typescript-eslint/no-empty-object-type": ["warn", { allowInterfaces: "always" }],
    "@typescript-eslint/no-misused-promises": [2, { checksVoidReturn: { arguments: false, attributes: false } }],
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
  },
};

const configuration = defineConfig([
  globalIgnores([
    "dist/**",
    "build/**",
    "coverage/**",
    "node_modules/**",
    "jest.global-*.ts",
    "jest.config*",
    "*.config.*",
  ]),
  {
    files: ["**/*.{ts,js}"],
    settings: {
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"],
          noWarnOnMultipleProjects: true,
        },
        node: true,
      },
    },
  },
  eslintjs.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  eslintConfigPrettier,
  base,
]);

export default configuration;
