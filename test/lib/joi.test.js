const xss = require('../../index');
const Joi = require('joi').extend(xss('object'), xss('array'), xss('string'));

describe('joi-xss', () => {
  it('expect to be a function', () => {
    expect(xss).toBeFunction();
  });
  it('expect extension be added to a base schema', () => {
    expect(Joi.object()).toHaveProperty('xss');
    expect(Joi.array()).toHaveProperty('xss');
    expect(Joi.string()).toHaveProperty('xss');
  });
  it('expect to escape html chars in an input of string type', () => {
    // Given:
    const input = '<p>hola</p>';

    // When:
    const { value } = Joi.string().xss().validate(input);

    // then:
    expect(value).toBe('&lt;p&gt;hola&lt;/p&gt;');
  });
  it('expect escape html chars in plain objects when key is string', () => {
    // Given:
    const input = { name: '<p>hola</p>' };

    // When:
    const { value } = Joi.object().unknown(true).xss().validate(input);

    // Then:
    expect(value.name).toBe('&lt;p&gt;hola&lt;/p&gt;');
  });
  it('expect to use options passed through', () => {
    // Given:
    const input = { name: '<p>hola</p>' };

    // When:
    const result = Joi.object().unknown(true).xss({ stripIgnoreTag: true }).validate(input);

    // Then:
    expect(result.value.name).toBe('hola');
  });
  it('expect escape deeply in objects', () => {
    // Given:
    const inputs = [
      {
        name: '<p>hola</p>',
        extra: { nombre: '<p>hi</p>' },
      },
      {
        name: '<p>mmmm</p>',
        school: {
          name: '<b>St. Petterson Louis III</b>',
          bingo: ['bingo', 'nothing', '<i>okay</i>', { name: '<br>aja</br>' }],
        },
      },
    ];

    let i = 0;

    for (i; i < inputs.length; i++) {
      const options = { stripIgnoreTag: true, deep: true };

      // When:
      const result = Joi.object().unknown(true).xss(options).validate(inputs[i]);

      // Then:
      if (i === 0) {
        expect(result.value.name).toBe('hola');
        expect(result.value.extra.nombre).toBe('hi');
      } else {
        expect(result.value.name).toBe('mmmm');
        expect(result.value.school.name).toBe('St. Petterson Louis III');
        expect(result.value.school.bingo[2]).toBe('okay');
        expect(result.value.school.bingo[3].name).toBe('aja');
      }
    }
  });
  it('expect escape deeply in arrays', () => {
    // Given:
    const inputs = [
      [{ name: '<p>hola</p>', extra: { nombre: '<p>hi</p>' } }],
      [
        'asereje',
        'ja',
        'deje',
        '<script>achu</script>',
        {
          element1: 'wiri',
          element2: '<script>ujum</script>',
          element3: '<i>nope</i>',
          element4: [
            'canls', '<iframe>listo</iframe>',
            { nothing: null },
            [undefined],
          ],
        },
        34,
        true,
      ],
    ];
    let i = 0;

    for (i; i < inputs.length; i++) {
      const options = { stripIgnoreTag: true, deep: true };

      // When:
      const result = Joi.array().xss(options).validate(inputs[i]);

      // Then:
      if (i === 0) {
        expect(result.value[0].name).toBe('hola');
        expect(result.value[0].extra.nombre).toBe('hi');
      } else {
        expect(result.value[3]).toBe('achu');
        expect(result.value[4].element2).toBe('ujum');
        expect(result.value[4].element4[1]).toBe('listo');
      }
    }
  });
});
