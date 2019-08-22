function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function objectHasProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function simpleClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getObjectWithDefaults(obj, defaultObj) {
  const newObj = simpleClone(defaultObj);
  return Object.assign(newObj, obj);
}

function prettyPrintObj(obj, spaces = 2) {
  return JSON.stringify(obj, null, spaces);
}

export {
  isPlainObject,
  objectHasProperty,
  getObjectWithDefaults,
  prettyPrintObj
};
