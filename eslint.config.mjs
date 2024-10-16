import cheminfo from "eslint-config-cheminfo/base";
import globals from "globals";

export default [
  ...cheminfo,
  {
    languageOptions: {
      globals: { ...globals.jest },
    },
  },
];
