module.exports = {
  "extends": "airbnb-base",
  "globals": {
    "artifacts": true,
    "contract": true,
    "it": true,
    "before": true,
    "beforeEach": true,
    "assert": true
  },
  "rules": {
    "no-console": "off",
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "no-loop-func": "off",
    "import/no-dynamic-require": "off",
    "global-require": "off",
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
  },
};
