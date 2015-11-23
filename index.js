/**
 * @file {@link http://xotic750.github.io/deep-equal-x/ deep-equal-x}
 * node's deepEqual algorithm.
 * @version 1.0.2
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module deep-equal-x
 */

/*jslint maxlen:80, es6:false, this:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:5, maxdepth:3,
  maxstatements:26, maxcomplexity:14 */

/*global require, module */

(function () {
  'use strict';

  var defProps = require('define-properties'),
    isRegExp = require('is-regex'),
    isDate = require('is-date-object'),
    isArguments = require('is-arguments'),
    isPrimitive = require('is-primitive'),
    isObject = require('is-object'),
    isBuffer = require('is-buffer');

  function deepEqual(actual, expected) {
    var length, i;
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
      return actual == expected;
    }

    // 7.5 For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
    return objEquiv(actual, expected);
  }

  function objEquiv(a, b) {
    /*jshint eqnull:true */
    if (a == null || b == null) {
      return false;
    }
    // an identical 'prototype' property.
    if (a.prototype !== b.prototype) {
      return false;
    }
    // if one is a primitive, the other must be same
    if (isPrimitive(a) || isPrimitive(b)) {
      return a === b;
    }
    var aIsArgs = isArguments(a),
        bIsArgs = isArguments(b);
    if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs) {
      return false;
    }
    if (aIsArgs) {
      a = Array.prototype.slice.call(a);
      b = Array.prototype.slice.call(b);
      return deepEqual(a, b);
    }
    var ka = Object.keys(a),
        kb = Object.keys(b),
        key, i;
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
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }

  module.exports = deepEqual;
}());
