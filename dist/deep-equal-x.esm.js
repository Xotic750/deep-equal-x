function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import isDate from 'is-date-object';
import isArguments from 'is-arguments';
import isPrimitive from 'is-primitive';
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
import toBoolean from 'to-boolean-x'; // Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)

var hasBoxedStringBug = hasBoxedString === false; // Used to detect unsigned integer values.

var reIsUint = /^(?:0|[1-9]\d*)$/;
/* eslint-disable-next-line compat/compat */

var hasMapEnumerables = typeof Map === 'function' ? $keys(new Map()) : [];
/* eslint-disable-next-line compat/compat */

var hasSetEnumerables = typeof Set === 'function' ? $keys(new Set()) : [];
var hasErrorEnumerables;

try {
  // noinspection ExceptionCaughtLocallyJS
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

var isIndex = function isIndex(value) {
  var num = indexNotFound;

  if (reIsUint.test(value)) {
    num = Number(value);
  }

  return num > indexNotFound && num % 1 === 0 && num < maxSafeIndex;
}; // eslint-disable jsdoc/require-param
// noinspection JSCommentMatchesSignature

/**
 * Get an object's key avoiding boxed string bug. Specifically for boxed
 * string bug fix and not general purpose.
 *
 * @private
 * @param {Array|string|object} object - The object to get the `value` from.
 * @param {string|number} key - The `key` reference to the `value`.
 * @param {boolean} isStr - Is the object a string.
 * @param {boolean} isIdx - Is the `key` a character index.
 * @returns {*} Returns the `value` referenced by the `key`.
 */
// eslint-enable jsdoc/require-param


var getItem = function getItem(args) {
  var _args = _slicedToArray(args, 4),
      object = _args[0],
      key = _args[1],
      isStr = _args[2],
      isIdx = _args[3];

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


var filterUnwanted = function filterUnwanted(keys, unwanted) {
  return unwanted.length ? filter(keys, function predicate(key) {
    return indexOf(unwanted, key) === indexNotFound;
  }) : keys;
}; // eslint-disable jsdoc/require-param
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
 * @param {object} previousStack - The circular stack.
 * @returns {boolean} `true` if `actual` and `expected` are deemed equal,
 *  otherwise `false`.
 */
// eslint-enable jsdoc/require-param


var baseDeepEqual = function baseDeepEqual(args) {
  var _args2 = _slicedToArray(args, 4),
      actual = _args2[0],
      expected = _args2[1],
      strict = _args2[2],
      previousStack = _args2[3]; // 7.1. All identical values are equivalent, as determined by ===.


  if (actual === expected) {
    return true;
  }

  if (isBuffer(actual) && isBuffer(expected)) {
    return actual.length === expected.length && some(actual, function predicate(item, index) {
      return item !== expected[index];
    }) === false;
  } // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.


  if (isDate(actual) && isDate(expected)) {
    return actual.getTime() === expected.getTime();
  } // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same `source` and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase` & `sticky`).


  if (isRegExp(actual) && isRegExp(expected)) {
    return actual.toString() === expected.toString() && actual.lastIndex === expected.lastIndex;
  } // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by == or strict ===.


  if (isObject(actual) === false && isObject(expected) === false) {
    if (strict) {
      return actual === expected;
    } // noinspection EqualityComparisonWithCoercionJS


    return actual == expected;
    /* eslint-disable-line eqeqeq */
  } // 7.5 For all other Object pairs, including Array objects, equivalence is
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
  } // if one is actual primitive, the other must be same


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

    return baseDeepEqual([slice(actual), slice(expected), strict, null]);
  }

  ka = $keys(actual);
  kb = $keys(expected); // having the same number of owned properties (keys incorporates hasOwnProperty)

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
  } // the same set of keys (although not necessarily the same order),


  sort.inplace(ka);
  sort.inplace(kb);
  var aIsString;
  var bIsString;

  if (hasBoxedStringBug) {
    aIsString = isString(actual);
    bIsString = isString(expected);
  } // ~~~cheap key test
  // equivalent values for every corresponding key, and
  // ~~~possibly expensive deep test


  return some(ka, function predicate(key, index) {
    if (key !== kb[index]) {
      return true;
    }

    var isIdx = (aIsString || bIsString) && isIndex(key);
    var stack = previousStack || [actual];
    var item = getItem([actual, key, aIsString, isIdx]);
    var isPrim = isPrimitive(item);

    if (isPrim === false) {
      if (indexOf(stack, item) !== indexNotFound) {
        throw new RangeError('Circular object');
      }

      stack.push(item);
    }

    var result = baseDeepEqual([item, getItem([expected, key, bIsString, isIdx]), strict, stack]) === false;

    if (isPrim === false) {
      stack.pop();
    }

    return result;
  }) === false;
}; // eslint-enable jsdoc/require-param
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


var deepEqual = function deepEqual(actual, expected) {
  /* eslint-disable-next-line prefer-rest-params */
  return baseDeepEqual([actual, expected, toBoolean(arguments[2])]);
};

export default deepEqual;

//# sourceMappingURL=deep-equal-x.esm.js.map