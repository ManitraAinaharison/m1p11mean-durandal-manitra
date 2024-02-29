module.exports.createEnum = function createEnum(values) {
  const enumObject = {};
  for (const val of values) {
    enumObject[val] = val;
  }

  enumObject.includes = function (value) {
    return Object.values(this).includes(value);
  };
  return Object.freeze(enumObject);
}

module.exports.sum = function sum(values) {
  return values.reduce((partialSum, a) => partialSum + a, 0);
}
