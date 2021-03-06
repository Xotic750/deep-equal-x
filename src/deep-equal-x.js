import isDate from 'is-date-object';
import isArguments from 'is-arguments';
import isPrimitive from 'is-primitive-x';
import isObject from 'is-object';
import isBuffer from 'is-buffer';
import isString from 'is-string';
import isError from 'is-error-x';
import isMap from 'is-map-x';
import isSet from 'is-set-x';
import isNil from 'is-nil-x';
import isRegExp from 'is-regexp-x';
import indexOf from 'index-of-x';
import slice from 'array-slice-x';
import some from 'array-some-x';
import filter from 'array-filter-x';
import sort from 'stable';
import $keys from 'object-keys-x';
import $getPrototypeOf from 'get-prototype-of-x';
import hasBoxedString from 'has-boxed-string-x';
import toBoolean from 'to-boolean-x';
import methodize from 'simple-methodize-x';
import toNumber from 'to-number-x';

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
const hasBoxedStringBug = hasBoxedString === false;
// Used to detect unsigned integer values.
const reIsUint = /^(?:0|[1-9]\d*)$/;
const methodizedTest = methodize(reIsUint.test);
const methodizedRxToString = methodize(reIsUint.toString);
const getTime = methodize(Date.prototype.getTime);
const charAt = methodize(''.charAt);
const tempArray = [];
const push = methodize(tempArray.push);
const pop = methodize(tempArray.pop);
/* eslint-disable-next-line compat/compat */
const hasMapEnumerables = typeof Map === 'function' ? $keys(new Map()) : [];
/* eslint-disable-next-line compat/compat */
const hasSetEnumerables = typeof Set === 'function' ? $keys(new Set()) : [];
let hasErrorEnumerables;

try {
  // noinspection ExceptionCaughtLocallyJS
  throw new Error('a');
} catch (e) {
  hasErrorEnumerables = $keys(e);
}

const indexNotFound = -1;
const maxSafeIndex = 4294967295; // (2^32)-1

/**
 * Checks if `value` is a valid string index. Specifically for boxed string
 * bug fix and not general purpose.
 *
 * @private
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if `value` is valid index, else `false`.
 */
const isIndex = function isIndex(value) {
  let num = indexNotFound;

  if (methodizedTest(reIsUint, value)) {
    num = toNumber(value);
  }

  return num > indexNotFound && num % 1 === 0 && num < maxSafeIndex;
};

// eslint-disable jsdoc/require-param
// noinspection JSCommentMatchesSignature
/**
 * Get an object's key avoiding boxed string bug. Specifically for boxed
 * string bug fix and not general purpose.
 *
 * @private
 * @param {Array|string|object} object - The object to get the `value` from.
 * @param {string|number} key - The `key` reference to the `value`.
 * @param {boolean} isStr - Is the object a string.
 * @param args
 * @param {boolean} isIdx - Is the `key` a character index.
 * @returns {*} Returns the `value` referenced by the `key`.
 */
// eslint-enable jsdoc/require-param
const getItem = function getItem(args) {
  const [object, key, isStr, isIdx] = args;

  return isStr && isIdx ? charAt(key, object) : object[key];
};

/**
 * Filter `keys` of unwanted Error enumerables. Specifically for Error has
 * unwanted enumerables fix and not general purpose.
 *
 * @private
 * @param {Array} keys - The Error object's keys.
 * @param {Array} unwanted - The unwanted keys.
 * @returns {Array} Returns the filtered keys.
 */
const filterUnwanted = function filterUnwanted(keys, unwanted) {
  return unwanted.length
    ? filter(keys, function predicate(key) {
        return indexOf(unwanted, key) === indexNotFound;
      })
    : keys;
};

// eslint-disable jsdoc/require-param
// noinspection JSCommentMatchesSignature
/**
 * Tests for deep equality. Primitive values are compared with the equal
 * comparison operator ( == ). This only considers enumerable properties.
 * It does not test object prototypes, attached symbols, or non-enumerable
 * properties. This can lead to some potentially surprising results. If
 * `strict` is `true` then Primitive values are compared with the strict
 * equal comparison operator ( === ).
 *
 * @private
 * @param {*} actual - First comparison object.
 * @param {*} expected - Second comparison object.
 * @param {boolean} [strict] - Comparison mode. If set to `true` use `===`.
 * @param args
 * @param {object} previousStack - The circular stack.
 * @returns {boolean} `true` if `actual` and `expected` are deemed equal,
 * otherwise `false`.
 */
// eslint-enable jsdoc/require-param
const baseDeepEqual = function baseDeepEqual(args) {
  const [actual, expected, strict, previousStack] = args;

  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  }

  if (isBuffer(actual) && isBuffer(expected)) {
    return (
      actual.length === expected.length &&
      some(actual, function predicate(item, index) {
        return item !== expected[index];
      }) === false
    );
  }

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  if (isDate(actual) && isDate(expected)) {
    return getTime(actual) === getTime(expected);
  }

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same `source` and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase` & `sticky`).
  if (isRegExp(actual) && isRegExp(expected)) {
    return methodizedRxToString(actual) === methodizedRxToString(expected) && actual.lastIndex === expected.lastIndex;
  }

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by == or strict ===.
  if (isObject(actual) === false && isObject(expected) === false) {
    if (strict) {
      return actual === expected;
    }

    // noinspection EqualityComparisonWithCoercionJS
    return actual == expected; /* eslint-disable-line eqeqeq */
  }

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  if (isNil(actual) || isNil(expected)) {
    return false;
  }

  /* jshint eqnull:false */
  // This only considers enumerable properties. It does not test object
  // prototypes, attached symbols, or non-enumerable properties. This can
  // lead to some potentially surprising results.
  if (strict && $getPrototypeOf(actual) !== $getPrototypeOf(expected)) {
    return false;
  }

  // if one is actual primitive, the other must be same
  if (isPrimitive(actual) || isPrimitive(expected)) {
    return actual === expected;
  }

  let ka = isArguments(actual);
  let kb = isArguments(expected);
  const aNotB = ka && kb === false;
  const bNotA = ka === false && kb;

  if (aNotB || bNotA) {
    return false;
  }

  if (ka) {
    if (ka.length !== kb.length) {
      return false;
    }

    return baseDeepEqual([slice(actual), slice(expected), strict, null]);
  }

  ka = $keys(actual);
  kb = $keys(expected);

  // having the same number of owned properties (keys incorporates hasOwnProperty)
  if (ka.length !== kb.length) {
    return false;
  }

  if (isObject(actual)) {
    if (isError(actual)) {
      ka = filterUnwanted(ka, hasErrorEnumerables);
    } else if (isMap(actual)) {
      ka = filterUnwanted(ka, hasMapEnumerables);
    } else if (isSet(actual)) {
      ka = filterUnwanted(ka, hasSetEnumerables);
    }
  }

  if (isObject(expected)) {
    if (isError(expected)) {
      kb = filterUnwanted(kb, hasErrorEnumerables);
    } else if (isMap(expected)) {
      kb = filterUnwanted(kb, hasMapEnumerables);
    } else if (isSet(expected)) {
      kb = filterUnwanted(kb, hasSetEnumerables);
    }
  }

  // the same set of keys (although not necessarily the same order),
  sort.inplace(ka);
  sort.inplace(kb);
  let aIsString;
  let bIsString;

  if (hasBoxedStringBug) {
    aIsString = isString(actual);
    bIsString = isString(expected);
  }

  // ~~~cheap key test
  // equivalent values for every corresponding key, and
  // ~~~possibly expensive deep test
  return (
    some(ka, function predicate(key, index) {
      if (key !== kb[index]) {
        return true;
      }

      const isIdx = (aIsString || bIsString) && isIndex(key);
      const stack = previousStack || [actual];
      const item = getItem([actual, key, aIsString, isIdx]);
      const isPrim = isPrimitive(item);

      if (isPrim === false) {
        if (indexOf(stack, item) !== indexNotFound) {
          throw new RangeError('Circular object');
        }

        push(stack, item);
      }

      const result = baseDeepEqual([item, getItem([expected, key, bIsString, isIdx]), strict, stack]) === false;

      if (isPrim === false) {
        pop(stack);
      }

      return result;
    }) === false
  );
};

// eslint-enable jsdoc/require-param
// noinspection JSCommentMatchesSignature
/**
 * Tests for deep equality. Primitive values are compared with the equal
 * comparison operator ( == ). This only considers enumerable properties.
 * It does not test object prototypes, attached symbols, or non-enumerable
 * properties. This can lead to some potentially surprising results. If
 * `strict` is `true` then Primitive values are compared with the strict
 * equal comparison operator ( === ).
 *
 * @param {*} actual - First comparison object.
 * @param {*} expected - Second comparison object.
 * @param {boolean} [strict] - Comparison mode. If set to `true` use `===`.
 * @returns {boolean} `true` if `actual` and `expected` are deemed equal,
 *  otherwise `false`.
 * @see https://nodejs.org/api/assert.html
 */
// eslint-disable jsdoc/require-param
const deepEqual = function deepEqual(actual, expected) {
  /* eslint-disable-next-line prefer-rest-params */
  return baseDeepEqual([actual, expected, toBoolean(arguments[2])]);
};

export default deepEqual;
