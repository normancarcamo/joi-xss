const xss = require('xss');

const is = {
  array: x => Object.prototype.toString.call(x) === '[object Array]' || Array.isArray(x),
  object: (x) => {
    if (Object.prototype.toString.call(x) === '[object Object]') {
      return true;
    }
    if (x === null || x === undefined) {
      return false;
    }
    const prototype = Object.getPrototypeOf(x);
    return prototype === null || prototype === Object.prototype;
  },
};

module.exports = (type) => {
  function deep(value, args) {
    if (is.object(value)) {
      for (const key in value) {
        if (args.deep && (is.object(value[key]) || is.array(value[key]))) {
          deep(value[key], args);
        } else {
          value[key] = xss(value[key], args);
        }
      }
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
    type,
    base: joi[type](),
    rules: {
      xss: {
        method(args) {
          return this.$_addRule({
            name: 'xss',
            args: { args },
          });
        },
        args: [
          {
            name: 'args',
            assert: joi.any()
              .optional(),
            message: 'arg',
          },
        ],
        validate(value, helper, args, options) {
          if (type === 'object' || type === 'array') {
            deep(value, { whiteList: [], ...args.args });
          } else {
            value = xss(value, { whiteList: [], ...args.args });
          }
          return value;
        },
      },
    },
  });
};
