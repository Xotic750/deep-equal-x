/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/deep-equal-x">
 * <img src="https://travis-ci.org/Xotic750/deep-equal-x.svg?branch=master"
 * title="Travis status" alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/deep-equal-x">
 * <img src="https://david-dm.org/Xotic750/deep-equal-x.svg"
 * title="Dependency status" alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/deep-equal-x#info=devDependencies">
 * <img src="https://david-dm.org/Xotic750/deep-equal-x/dev-status.svg"
 * title="devDependency status" alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/deep-equal-x">
 * <img src="https://badge.fury.io/js/deep-equal-x.svg"
 * title="npm version" alt="npm version" height="18">
 * </a>
 *
 * node's deepEqual algorithm.
 * @version 1.0.5
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module deep-equal-x
 */

/*jslint maxlen:80, es6:false, this:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:3, maxdepth:3,
  maxstatements:44, maxcomplexity:23 */

/*global require, module */

;(function () {
  'use strict';

  var isRegExp = require('is-regex'),
    isDate = require('is-date-object'),
    isArguments = require('is-arguments'),
    isPrimitive = require('is-primitive'),
    isObject = require('is-object'),
    isBuffer = require('is-buffer'),
    isString = require('is-string'),
    pSlice = Array.prototype.slice,
    // Check failure of by-index access of string characters (IE < 9)
    // and failure of `0 in boxedString` (Rhino)
    boxedString = Object('a'),
    hasBoxedStringBug = boxedString[0] !== 'a' || !(0 in boxedString),
    // Used to detect unsigned integer values.
    reIsUint = /^(?:0|[1-9]\d*)$/,
    hasErrorEnumerables = [],
    ERROR = Error,
    prop;

  try {
    throw new ERROR('a');
  } catch (e) {
    for (prop in e) {
      /*jslint forin:true */
      hasErrorEnumerables.push(prop);
    }
  }

  /**
   * Checks if `value` is a valid string index. Specifically for boxed string
   * bug fix and not general purpose.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is valid index, else `false`.
   */
  function isIndex(value) {
    var num = -1;
    if (reIsUint.test(value)) {
      num = Number(value);
    }
    return num > -1 && num % 1 === 0 && num < 4294967295;
  }

  /**
   * Filter `keys` of unwanted Error enumerables. Specifically for Error has
   * unwanted enumerables fix and not general purpose.
   *
   * @private
   * @param {Array} keys The Error object's keys.
   * @returns {Array} Returns the filtered keys.
   */
  function filterError(keys) {
    return keys.filter(function (key) {
      return hasErrorEnumerables.indexOf(key) < 0;
    });
  }

  /**
   * Tests for deep equality. Primitive values are compared with the equal
   * comparison operator ( == ). This only considers enumerable properties.
   * It does not test object prototypes, attached symbols, or non-enumerable
   * properties. This can lead to some potentially surprising results. If
   * `strict` is `true` then Primitive values are compared with the strict
   * equal comparison operator ( === ).
   *
   * @param {*} actual First comparison object.
   * @param {*} expected Second comparison object.
   * @param {boolean} [strict] Comparison mode.
   * @return {boolean} `true` if `actual` and `expected` are deemed equal,
   *  otherwise `false`.
   * @see https://nodejs.org/api/assert.html
   * @example
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
    var length, i, ka, kb, aIsString, bIsString;
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    }
    if (isBuffer(actual) && isBuffer(expected)) {
      length = actual.length;
      if (length !== expected.length) {
        return false;
      }
      for (i = 0; i < length; i += 1) {
        if (actual[i] !== expected[i]) {
          return false;
        }
      }
      return true;
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
      return actual.source === expected.source &&
             actual.global === expected.global &&
             actual.multiline === expected.multiline &&
             actual.lastIndex === expected.lastIndex &&
             actual.ignoreCase === expected.ignoreCase &&
             actual.sticky === expected.sticky;
    }

    // 7.4. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by == or strict ===.
    if (!isObject(actual) && !isObject(expected)) {
      /*jshint eqeqeq:false */
      return strict === true ? actual === expected : actual == expected;
    }

    // 7.5 For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
    /*jshint eqnull:true */
    if (actual == null || expected == null) {
      return false;
    }
    // an identical 'prototype' property.
    if (actual.prototype !== expected.prototype) {
      return false;
    }
    // if one is actual primitive, the other must be same
    if (isPrimitive(actual) || isPrimitive(expected)) {
      return actual === expected;
    }
    ka = isArguments(actual);
    kb = isArguments(expected);
    if (ka && !kb || !ka && kb) {
      return false;
    }
    if (ka) {
      return deepEqual(pSlice.call(actual), pSlice.call(expected));
    }
    ka = Object.keys(actual);
    kb = Object.keys(expected);
    if (hasErrorEnumerables.length) {
      if (isObject(actual) && actual instanceof ERROR) {
        ka = filterError(ka);
      }
      if (isObject(expected) && expected instanceof ERROR) {
        kb = filterError(kb);
      }
    }
    // having the same number of owned properties (keys incorporates
    // hasOwnProperty)
    if (ka.length !== kb.length) {
      return false;
    }
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    if (hasBoxedStringBug) {
      aIsString = isString(actual);
      bIsString = isString(expected);
    }
    //~~~cheap key test
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    return !ka.some(function (key, index) {
      var isIdx, va, vb;
      if (key !== kb[index]) {
        return true;
      }
      if (aIsString || bIsString) {
        isIdx = isIndex(key);
      }
      if (aIsString && isIdx) {
        va = actual.charAt(key);
      } else {
        va = actual[key];
      }
      if (bIsString && isIdx) {
        vb = expected.charAt(key);
      } else {
        vb = expected[key];
      }
      return !deepEqual(va, vb);
    });
  };
}());
