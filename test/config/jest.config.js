'use strict';

module.exports = {
  "bail": true,
  "verbose": false,
  "collectCoverage": true,
  "expand": true,
  "testURL": "http://localhost/",
  "coverageDirectory": "./test/reports/coverage",
  "testEnvironment": "node",
  "rootDir": "../../",
  "setupTestFrameworkScriptFile": "./test/config/jest.setup.js",
  "transform": {
    "^.+\\.js$": "babel-jest"
  },
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "Fns",
      "outputPath": "test/reports/index.html",
      "includeFailureMsg": true,
      "theme": "lightTheme"
    }]
  ],
  "collectCoverageFrom": [
    "lib/**/*.js", "index.js"
  ],
};
