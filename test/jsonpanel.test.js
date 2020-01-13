// Jest does not yet support ES6 modules - this will have to do
const jsonpanel = require('../dist/jsonpanel-next.cjs');

const TEST_OBJ = Object.freeze({
  data: {
    obj: {
      foo: 'bar'
    }
  }
});

beforeEach(() => {
  document.body.innerHTML = '<div id="jsonpanel"></div>';
});

test('returns a Panel instance', () => {
  expect(jsonpanel({data: {}}).render).toEqual(expect.any(Function));
});

describe('nested object', () => {
  test('starts off collapsed', () => {
    jsonpanel(TEST_OBJ);
    expect(document.querySelector('li.expanded')).toBeNull();
  });

  test('adds a .expanded class when expanded', () => {
    jsonpanel(TEST_OBJ);
    document.querySelector('.expander').click();
    expect(document.querySelector('li.expanded')).not.toBeNull();
  });

  test('can handle null', () => {
    jsonpanel({
      data: {
        obj: {
          foo: null
        }
      }
    });
    document.querySelector('.expander').click();
    expect(document.querySelector('li.expanded')).not.toBeNull();
  });

  test('removes .expanded class when collapsed', () => {
    jsonpanel(TEST_OBJ);
    const expander = document.querySelector('.expander');
    expander.click();
    expander.click();
    expect(document.querySelector('li.expanded')).toBeNull();
  });
});

describe('nested array', () => {
  test('starts off collapsed', () => {
    jsonpanel({
      data: {
        ary: ['foo']
      }
    });
    expect(document.querySelector('li.expanded')).toBeNull();
  });

  test('adds a .expanded class when expanded', () => {
    jsonpanel({
      data: {
        ary: ['foo']
      }
    });
    document.querySelector('.expander').click();
    expect(document.querySelector('li.expanded')).not.toBeNull();
  });

  test('removes .expanded class when collapsed', () => {
    jsonpanel({
      data: {
        ary: ['foo']
      }
    });
    const expander = document.querySelector('.expander');
    expander.click();
    expander.click();
    expect(document.querySelector('li.expanded')).toBeNull();
  });
});

describe('value transformer', () => {
  test('transforms values when custom function is specified', () => {
    const testStr = 'A mix Of Upper and Lowercase.';

    jsonpanel({
      data: {
        testStr
      },
      valTransformer: str => str.toLowerCase()
    });

    const transformedVal = document.body.querySelector('.val.string')
      .textContent;
    expect(transformedVal).toBe(`"${testStr.toLowerCase()}"`);
  });

  test('transforms nested values', () => {
    const testStr = 'A mix Of Upper and Lowercase.';

    jsonpanel({
      data: {
        nested: {
          testStr
        }
      },
      valTransformer: str => str.toLowerCase()
    });

    document.body.querySelector('.expander').click();
    const transformedVal = document.body.querySelector('.val.string')
      .textContent;
    expect(transformedVal).toBe(`"${testStr.toLowerCase()}"`);
  });
});
