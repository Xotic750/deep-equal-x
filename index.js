/**
 * @file {@link https://github.com/Xotic750/deep-equal-x deep-equal-x}
 * node's deepEqual algorithm.
 * [![Build Status]
 * (https://travis-ci.org/Xotic750/deep-equal-x.svg?branch=master)]
 * (https://travis-ci.org/Xotic750/deep-equal-x)
 * [![Dependency Status](https://david-dm.org/Xotic750/deep-equal-x.svg)]
 * (https://david-dm.org/Xotic750/deep-equal-x)
 * [![devDependency Status]
 * (https://david-dm.org/Xotic750/deep-equal-x/dev-status.svg)]
 * (https://david-dm.org/Xotic750/deep-equal-x#info=devDependencies)
 * [![npm version](https://badge.fury.io/js/deep-equal-x.svg)]
 * (https://badge.fury.io/js/deep-equal-x)
 * @version 1.0.3
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
  maxstatements:46, maxcomplexity:23 */

/*global require, module */

(function () {
  'use strict';

  var isRegExp = require('is-regex'),
    isDate = require('is-date-object'),
    isArguments = require('is-arguments'),
    isPrimitive = require('is-primitive'),
    isObject = require('is-object'),
    isBuffer = require('is-buffer');

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
    var length, i, aIsArgs,bIsArgs, ka, kb, key;
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
    // equivalent if it is also a RegExp object with the same source and
    // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
    if (isRegExp(actual) && isRegExp(expected)) {
      return actual.source === expected.source &&
             actual.global === expected.global &&
             actual.multiline === expected.multiline &&
             actual.lastIndex === expected.lastIndex &&
             actual.ignoreCase === expected.ignoreCase &&
             actual.sticky === expected.sticky;
    }

    // 7.4. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
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
    aIsArgs = isArguments(actual);
    bIsArgs = isArguments(expected);
    if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs) {
      return false;
    }
    if (aIsArgs) {
      actual = Array.prototype.slice.call(actual);
      expected = Array.prototype.slice.call(expected);
      return deepEqual(actual, expected);
    }
    ka = Object.keys(actual);
    kb = Object.keys(expected);
    // having the same number of owned properties (keys incorporates
    // hasOwnProperty)
    if (ka.length !== kb.length) {
      return false;
    }
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i -= 1) {
      if (ka[i] !== kb[i]) {
        return false;
      }
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i -= 1) {
      key = ka[i];
      if (!deepEqual(actual[key], expected[key])) {
        return false;
      }
    }
    return true;
  };
}());
