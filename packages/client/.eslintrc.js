const path = require('path');

module.exports = {
  "extends": ["airbnb", "react-app", "prettier"],
  "plugins": ["prettier"],
  "env": {
    "browser": true,
    "node": true,
  },
  "settings": {
    "react": {
      "version": "^16.6.3",
    },
  },
  "rules": {
    "prettier/prettier": "error",
    "no-continue": "off",
    "no-console": "off",
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "no-underscore-dangle": "off",
    "global-require": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": ["**/*.test.js", "**/*.spec.js"],
        "packageDir": [
          path.join(__dirname),
          path.join(__dirname, '../../'),
        ]
      }
    ],
    "class-methods-use-this": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": "off",
    "react/prefer-stateless-function": "off",
  }
};
