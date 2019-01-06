const xss = require("xss");

const is = {
  array: (x) => Object.prototype.toString.call(x) === "[object Array]" || Array.isArray(x),
  object: (x) => {
    if (Object.prototype.toString.call(x) === "[object Object]") {
      return true;
    } else {
      if (x === null || x === undefined) {
        return false;
      } else {
        let prototype = Object.getPrototypeOf(x);
        return prototype === null || prototype === Object.prototype;
      }
    }
  }
};

module.exports = function(type) {
  function deep(value, args) {
    if (is.object(value)) {
      for (let key in value) {
        if (args.deep && (is.object(value[key]) || is.array(value[key]))) {
          deep(value[key], args);
        } else {
          value[key] = xss(value[key], args);
        }
      };
    } else {
      value.forEach((element, index) => {
        if (args.deep && (is.object(element) || is.array(element))) {
          deep(element, args);
        } else {
          value[index] = xss(element, args);
        }
      });
    }
  }

  return joi => ({
    base: joi[type](),
    name: type,
    language: { "xss": "{{msg}}" },
    rules: [{
      name: "xss",
      params: { args: joi.any().optional() },
      validate: ({ args }, value, state, options) => {
        if (type === "object" || type === "array") {
          deep(value, { whiteList: [], ...args });
        } else {
          value = xss(value, { whiteList: [], ...args });
        }
        return value;
      }
    }]
  });
}
