const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "visitor-access",
        "exhibitors",
        "business-rounds",
        "ai-assistant",
        "interactive-map",
        "landing",
        "i18n",
        "config",
        "ci",
        "deps",
        "adr",
        "architecture",
        "contributing",
        "repo",
      ],
    ],
  },
};

export default config;
