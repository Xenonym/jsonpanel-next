function isPlainObject(object) {
  return Object.prototype.toString.call(object) === '[object Object]';
}

function objectHasProperty(object, prop) {
  // Object.hasOwn is ES2022 and not supported in enough browsers
  /* eslint prefer-object-has-own: "off" */
  return Object.prototype.hasOwnProperty.call(object, prop);
}

function simpleClone(object) {
  return JSON.parse(JSON.stringify(object));
}

function getObjectWithDefaults(object, defaultObject) {
  const newObject = simpleClone(defaultObject);
  return Object.assign(newObject, object);
}

function prettyPrintObject(object, spaces = 2) {
  return JSON.stringify(object, null, spaces);
}

export {
  isPlainObject,
  objectHasProperty,
  getObjectWithDefaults,
  prettyPrintObject,
};
