const config = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    // React first
    "<TYPES>",
    "express",
    "^(react/(.*)$)|^(react$)",
    "<BUILTIN_MODULES>",
    // Third-party modules
    "<THIRD_PARTY_MODULES>",
    "",
    // All @/ imports
    "<TYPES>^@/(.*)$",
    "^@/(.*)$",
    // Specific @/hooks and @/lib
    "^@/hooks(/.*)?$",
    "^@/lib(/.*)?$",
    "",
    // Relative imports
    "<TYPES>^[.|..]",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "4.4.0",
  printWidth: 120,
  tabWidth: 2,
  semi: true,
};

module.exports = config;
