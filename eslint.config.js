import presetsNodeTypescriptPrettier from "@cybozu/eslint-config/flat/presets/node-typescript-prettier.js";

export default [
  ...presetsNodeTypescriptPrettier,
  {
    ignores: ["dist", "build"],
  },
  {
    rules: {
      "n/no-missing-import": "off",
      "n/hashbang": [
        "error",
        // https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/hashbang.md#convertpath
        {
          convertPath: { "src/**/*.ts": ["^src/(.+?)\\.ts$", "dist/$1.js"] },
          additionalExecutables: ["scripts/**/*"],
        },
      ],
    },
  },
];
