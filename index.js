/**
 * @file node's deepEqual and deepStrictEqual algorithm.
 * @version 1.7.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module deep-equal-x
 */

'use strict';

var isDate = require('is-date-object');
var isArguments = require('is-arguments');
var isPrimitive = require('is-primitive');
var isObject = require('is-object');
var isBuffer = require('is-buffer');
var isString = require('is-string');
var isError = require('is-error-x');
var isMap = require('is-map-x');
var isSet = require('is-set-x');
var isNil = require('is-nil-x');
var isRegExp = require('is-regex');
var indexOf = require('index-of-x');
var slice = require('array-slice-x');
var some = require('array.prototype.some');
var filter = require('lodash._arrayfilter');
var sort = require('stable');
var $keys = require('object-keys-x');
var $getPrototypeOf = require('get-prototype-of-x');

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var hasBoxedStringBug = boxedString[0] !== 'a' || (0 in boxedString) === false;
// Used to detect unsigned integer values.
var reIsUint = /^(?:0|[1-9]\d*)$/;
var hasMapEnumerables = typeof Map === 'function' ? $keys(new Map()) : [];
var hasSetEnumerables = typeof Set === 'function' ? $keys(new Set()) : [];
var hasErrorEnumerables;

try {
  throw new Error('a');
} catch (e) {
  hasErrorEnumerables = $keys(e);
}

var indexNotFound = -1;
var maxSafeIndex = 4294967295; // (2^32)-1

/**
 * Checks if `value` is a valid string index. Specifically for boxed string
 * bug fix and not general purpose.
 *
 * @private
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if `value` is valid index, else `false`.
 */
var isIndex = function _isIndex(value) {
  var num = indexNotFound;
  if (reIsUint.test(value)) {
    num = Number(value);
  }

  return num > indexNotFound && num % 1 === 0 && num < maxSafeIndex;
};

/**
 * Get an object's key avoiding boxed string bug. Specifically for boxed
 * string bug fix and not general purpose.
 *
 * @private
 * @param {Object} object - The object to get the `value` from.
 * @param {string} key - The `key` reference to the `value`.
 * @param {boolean} isStr - Is the object a string.
 * @param {boolean} isIdx - Is the `key` a character index.
 * @returns {*} Returns the `value` referenced by the `key`.
 */
// eslint-disable-next-line max-params
var getItem = function _getItem(object, key, isStr, isIdx) {
  return isStr && isIdx ? object.charAt(key) : object[key];
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
var filterUnwanted = function _filterUnwanted(keys, unwanted) {
  return unwanted.length ? filter(keys, function _filter(key) {
    return indexOf(unwanted, key) === indexNotFound;
  }) : keys;
};

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
 * @param {Object} - previousStack The circular stack.
 * @returns {boolean} `true` if `actual` and `expected` are deemed equal,
 *  otherwise `false`.
 */
// eslint-disable-next-line max-params, complexity
var baseDeepEqual = function _baseDeepEqual(actual, expected, strict, previousStack) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  }

  if (isBuffer(actual) && isBuffer(expected)) {
    return actual.length === expected.length && some(actual, function _some1(item, index) {
      return item !== expected[index];
    }) === false;
  }

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  if (isDate(actual) && isDate(expected)) {
    return actual.getTime() === expected.getTime();
  }

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same `source` and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase` & `sticky`).
  if (isRegExp(actual) && isRegExp(expected)) {
    return actual.toString() === expected.toString() && actual.lastIndex === expected.lastIndex;
  }

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by == or strict ===.
  if (isObject(actual) === false && isObject(expected) === false) {
    if (strict) {
      return actual === expected;
    }

    // eslint-disable-next-line eqeqeq
    return actual == expected;
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

  var ka = isArguments(actual);
  var kb = isArguments(expected);
  var aNotB = ka && kb === false;
  var bNotA = ka === false && kb;
  if (aNotB || bNotA) {
    return false;
  }

  if (ka) {
    if (ka.length !== kb.length) {
      return false;
    }

    return baseDeepEqual(slice(actual), slice(expected), strict, null);
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
  var aIsString, bIsString;
  if (hasBoxedStringBug) {
    aIsString = isString(actual);
    bIsString = isString(expected);
  }

  // ~~~cheap key test
  // equivalent values for every corresponding key, and
  // ~~~possibly expensive deep test
  return some(ka, function _some2(key, index) {
    if (key !== kb[index]) {
      return true;
    }

    var isIdx = (aIsString || bIsString) && isIndex(key);
    var stack = previousStack ? previousStack : [actual];
    var item = getItem(actual, key, aIsString, isIdx);
    var isPrim = isPrimitive(item);
    if (isPrim === false) {
      if (indexOf(stack, item) !== indexNotFound) {
        throw new RangeError('Circular object');
      }

      stack.push(item);
    }

    var result = baseDeepEqual(
      item,
      getItem(expected, key, bIsString, isIdx),
      strict,
      stack
    ) === false;

    if (isPrim === false) {
      stack.pop();
    }

    return result;
  }) === false;
};

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
 * @example
 * var deepEqual = require('deep-equal-x');
 *
 * deepEqual(Error('a'), Error('b'));
 * // => true
 * // This does not return `false` because the properties on the  Error object
 * // are non-enumerable:
 *
 * deepEqual(4, '4');
 * // => true
 *
 * deepEqual({ a: 4, b: '1' }, {  b: '1', a: 4 });
 * // => true
 *
 * deepEqual(new Date(), new Date(2000, 3, 14));
 * // => false
 *
 * deepEqual(4, '4', true);
 * // => false
 */
module.exports = function deepEqual(actual, expected, strict) {
  return baseDeepEqual(actual, expected, strict);
};
