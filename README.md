# joi-xss
Avoid XSS with the help of Joi validator

## Example

```js
const xss = require('@ncardez/joi-xss');
const Joi = require('@hapi/joi').extend(xss('object'), xss('array'), xss('string'));
  
const input = { name: "<p>hola</p>" };

// Return result.
const { value } = Joi.object().unknown(true).xss().validate(input);
//  value.name === '&lt;p&gt;hola&lt;/p&gt;'

// You can also pass options.
const { value } = Joi.object().unknown(true).xss({ stripIgnoreTag: true }).validate(input);
//  value.name === 'hola'

```
