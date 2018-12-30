"use strict";

require('jest-extended');
require('jest-chain');

process.on("unhandledRejection", err => {
  if (err.message !== "test") {
    console.error("TestSuite: unhandledRejection ->", err.message);
  }
});

process.on("uncaughtException", err => {
  console.error("TestSuite: uncaughtException ->", err.message);
});

expect.extend({});
