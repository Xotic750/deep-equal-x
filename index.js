/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/deep-equal-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/deep-equal-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/deep-equal-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/deep-equal-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/deep-equal-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/deep-equal-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/deep-equal-x" title="npm version">
 * <img src="https://badge.fury.io/js/deep-equal-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * node's deepEqual and deepStrictEqual algorithm. Will work in ES3 environments
 * if you load es5-shim, which is recommended for all environments to fix native
 * issues.
 * @version 1.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module deep-equal-x
 */

/*jslint maxlen:80, es6:false, this:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:4, maxdepth:3,
  maxstatements:51, maxcomplexity:27 */

/*global require, module */

;(function () {
  'use strict';

  var ES = require('es-abstract'),
    isDate = require('is-date-object'),
    isArguments = require('is-arguments'),
    isPrimitive = require('is-primitive'),
    isObject = require('is-object'),
    isBuffer = require('is-buffer'),
    isString = require('is-string'),
    indexOf = require('index-of-x'),
    StackSet = require('collections-x').Set,
    pSlice = Array.prototype.slice,
    pSome = Array.prototype.some,
    pFilter = Array.prototype.filter,
    pSort = Array.prototype.sort,
    pTest = RegExp.prototype.test,
    pCharAt = String.prototype.charAt,
    pGetTime = Date.prototype.getTime,
    $keys = Object.keys,
    $Number = Number,
    nativeGetPrototypeOf = Object.getPrototypeOf,
    // Check failure of by-index access of string characters (IE < 9)
    // and failure of `0 in boxedString` (Rhino)
    boxedString = Object('a'),
    hasBoxedStringBug = boxedString[0] !== 'a' || !(0 in boxedString),
    // Used to detect unsigned integer values.
    reIsUint = /^(?:0|[1-9]\d*)$/,
    ERROR = Error,
    MAP = typeof Map !== 'undefined' && Map,
    SET = typeof Set !== 'undefined' && Set,
    hasMapEnumerables = MAP ? $keys(new MAP()) : MAP,
    hasSetEnumerables = SET ? $keys(new SET()) : SET,
    hasErrorEnumerables, de, prototypeOfObject, $getPrototypeOf;

  try {
    throw new ERROR('a');
  } catch (e) {
    hasErrorEnumerables = $keys(e);
  }

  if (nativeGetPrototypeOf) {
    try {
      nativeGetPrototypeOf(1);
      $getPrototypeOf = nativeGetPrototypeOf;
    } catch (ignore) {
      /**
       * Return the value of the [[Prototype]] internal property of object.
       * Based on the ECMA6 spec, which only throws on `undefined` or `null`.
       *
       * @private
       * @param {Object} value The object whose prototype is to be returned.
       * @return {Null|Object} The prototype of the object.
       */
      $getPrototypeOf = function getPrototypeOf(value) {
        return nativeGetPrototypeOf(ES.ToObject(value));
      };
    }
  } else {
    // Opera Mini breaks here with infinite loops
    prototypeOfObject = Object.prototype;
    /**
     * Return the value of the [[Prototype]] internal property of object.
     * Based on the ECMA6 spec, which only throws on `undefined` or `null`.
     *
     * @private
     * @name $getPrototypeOf
     * @param {Object} value The object whose prototype is to be returned.
     * @return {Null|Object} The prototype of the object.
     */
    $getPrototypeOf = function getPrototypeOf(value) {
      var object = ES.ToObject(value),
        /*jshint proto:true */
        proto = object.__proto__;
      /*jshint proto:false */
      if (proto || proto === null) {
        return proto;
      }
      if (ES.IsCallable(object.constructor)) {
        return object.constructor.prototype;
      }
      if (object instanceof Object) {
        return prototypeOfObject;
      }
      // Correctly return null for Objects created with `Object.create(null)`
      // (shammed or native) or `{ __proto__: null}`.  Also returns null for
      // cross-realm objects on browsers that lack `__proto__` support (like
      // IE <11), but that's the best we can do.
      return null;
    };
  }

  /**
   * Checks if `value` is a valid string index. Specifically for boxed string
   * bug fix and not general purpose.
   *
   * @private
   * @param {*} value The value to check.
   * @return {boolean} Returns `true` if `value` is valid index, else `false`.
   */
  function isIndex(value) {
    var num = -1;
    if (ES.Call(pTest, reIsUint, [value])) {
      num = $Number(value);
    }
    return num > -1 && num % 1 === 0 && num < 4294967295;
  }

  /**
   * Get an object's key avoiding boxed string bug. Specifically for boxed
   * string bug fix and not general purpose.
   *
   * @private
   * @param {Object} object The object to get the `value` from.
   * @param {string} key The `key` reference to the `value`.
   * @param {boolean} isStr Is the object a string.
   * @param {boolean} isIdx Is the `key` a character index.
   * @return {*} Returns the `value` referenced by the `key`.
   */
  function getItem(object, key, isStr, isIdx) {
    if (isStr && isIdx) {
      return ES.Call(pCharAt, object, [key]);
    }
    return object[key];
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
    return ES.Call(pFilter, keys, [function (key) {
      return indexOf(hasErrorEnumerables, key) < 0;
    }]);
  }

  /**
   * Filter `keys` of unwanted Map enumerables.
   *
   * @private
   * @param {Array} keys The Map object's keys.
   * @returns {Array} Returns the filtered keys.
   */
  function filterMap(keys) {
    return ES.Call(pFilter, keys, [function (key) {
      return indexOf(hasMapEnumerables, key) < 0;
    }]);
  }

  /**
   * Filter `keys` of unwanted Set enumerables.
   *
   * @private
   * @param {Array} keys The Set object's keys.
   * @returns {Array} Returns the filtered keys.
   */
  function filterSet(keys) {
    return ES.Call(pFilter, keys, [function (key) {
      return indexOf(hasSetEnumerables, key) < 0;
    }]);
  }

  /**
   * Tests for deep equality. Primitive values are compared with the equal
   * comparison operator ( == ). This only considers enumerable properties.
   * It does not test object prototypes, attached symbols, or non-enumerable
   * properties. This can lead to some potentially surprising results. If
   * `strict` is `true` then Primitive values are compared with the strict
   * equal comparison operator ( === ).
   *
   * @private
   * @param {*} actual First comparison object.
   * @param {*} expected Second comparison object.
   * @param {boolean} [strict] Comparison mode. If set to `true` use `===`.
   * @param {Object} previousStack The circular stack.
   * @return {boolean} `true` if `actual` and `expected` are deemed equal,
   *  otherwise `false`.
   */
  de = function baseDeepEqual(actual, expected, strict, previousStack) {
    var stack, ka, kb, aIsString, bIsString;
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    }
    if (isBuffer(actual) && isBuffer(expected)) {
      if (actual.length !== expected.length) {
        return false;
      }
      return !ES.Call(pSome, actual, [function (item, index) {
        return item !== expected[index];
      }]);
    }

    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
    if (isDate(actual) && isDate(expected)) {
      return ES.Call(pGetTime, actual) === ES.Call(pGetTime, expected);
    }

    // 7.3 If the expected value is a RegExp object, the actual value is
    // equivalent if it is also a RegExp object with the same `source` and
    // properties (`global`, `multiline`, `lastIndex`, `ignoreCase` & `sticky`).
    if (ES.IsRegExp(actual) && ES.IsRegExp(expected)) {
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
      return strict ? actual === expected : actual == expected;
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
    /*jshint eqnull:false */
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
    ka = isArguments(actual);
    kb = isArguments(expected);
    if (ka && !kb || !ka && kb) {
      return false;
    }
    if (ka) {
      if (ka.length !== kb.length) {
        return false;
      }
      return baseDeepEqual(
        ES.Call(pSlice, actual),
        ES.Call(pSlice, expected),
        strict,
        stack
      );
    }
    ka = $keys(actual);
    kb = $keys(expected);
    // having the same number of owned properties (keys incorporates
    // hasOwnProperty)
    if (ka.length !== kb.length) {
      return false;
    }
    if (isObject(actual)) {
      if (hasErrorEnumerables.length && actual instanceof ERROR) {
        ka = filterError(ka);
      }
      if (hasMapEnumerables &&
        hasMapEnumerables.length && actual instanceof MAP) {
        ka = filterMap(ka);
      }
      if (hasSetEnumerables &&
        hasSetEnumerables.length && actual instanceof SET) {
        ka = filterSet(ka);
      }
    }
    if (isObject(expected)) {
      if (hasErrorEnumerables.length && expected instanceof ERROR) {
        kb = filterError(kb);
      }
      if (hasMapEnumerables && expected instanceof MAP) {
        kb = filterMap(kb);
      }
      if (hasSetEnumerables && expected instanceof SET) {
        kb = filterSet(kb);
      }
    }
    //the same set of keys (although not necessarily the same order),
    ES.Call(pSort, ka);
    ES.Call(pSort, kb);
    if (hasBoxedStringBug) {
      aIsString = isString(actual);
      bIsString = isString(expected);
    }
    //~~~cheap key test
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    return !ES.Call(pSome, ka, [function (key, index) {
      var isIdx, isPrim, result, item;
      if (key !== kb[index]) {
        return true;
      }
      if (aIsString || bIsString) {
        isIdx = isIndex(key);
      }
      stack = previousStack ? previousStack : new StackSet([actual]);
      item = getItem(actual, key, aIsString, isIdx);
      isPrim = isPrimitive(item);
      if (!isPrim) {
        if (stack.has(item)) {
          throw new RangeError('Maximum call stack size exceeded');
        }
        stack.add(item);
      }
      result = !de(
        item,
        getItem(expected, key, bIsString, isIdx),
        strict,
        stack
      );
      if (!isPrim) {
        stack.delete(item);
      }
      return result;
    }]);
  };

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
   * @param {boolean} [strict] Comparison mode. If set to `true` use `===`.
   * @return {boolean} `true` if `actual` and `expected` are deemed equal,
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
    return de(actual, expected, strict);
  };
}());
