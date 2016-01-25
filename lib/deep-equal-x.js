(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.returnExports = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
 * node's deepEqual and deepStrictEqual algorithm.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.2.9
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module deep-equal-x
 */

/*jslint maxlen:80, es6:false, this:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:4, maxdepth:2,
  maxstatements:45, maxcomplexity:26 */

/*global require, module */

;(function () {
  'use strict';

  var isDate = _dereq_('is-date-object');
  var isArguments = _dereq_('is-arguments');
  var isPrimitive = _dereq_('is-primitive');
  var isObject = _dereq_('is-object');
  var isBuffer = _dereq_('is-buffer');
  var isString = _dereq_('is-string');
  var isError = _dereq_('is-error-x');
  var isMap = _dereq_('is-map-x');
  var isSet = _dereq_('is-set-x');
  var isNil = _dereq_('is-nil-x');
  var isRegExp = _dereq_('is-regex');
  var pIndexOf = Array.prototype.indexOf;
  var pPush = Array.prototype.push;
  var pPop = Array.prototype.pop;
  var pSlice = Array.prototype.slice;
  var pSome = Array.prototype.some;
  var pFilter = Array.prototype.filter;
  var pSort = Array.prototype.sort;
  var pTest = RegExp.prototype.test;
  var rToString = RegExp.prototype.toString;
  var pCharAt = String.prototype.charAt;
  var pGetTime = Date.prototype.getTime;
  var $Number = Number;
  var $keys = Object.keys;
  var $getPrototypeOf = Object.getPrototypeOf;
  // Check failure of by-index access of string characters (IE < 9)
  // and failure of `0 in boxedString` (Rhino)
  var boxedString = Object('a');
  var hasBoxedStringBug = boxedString[0] !== 'a' || !(0 in boxedString);
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
    if (pTest.call(reIsUint, value)) {
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
    return isStr && isIdx ? pCharAt.call(object, key) : object[key];
  }

  /**
   * Filter `keys` of unwanted Error enumerables. Specifically for Error has
   * unwanted enumerables fix and not general purpose.
   *
   * @private
   * @param {Array} keys The Error object's keys.
   * @param {Array} unwanted The unwanted keys.
   * @returns {Array} Returns the filtered keys.
   */
  function filterUnwanted(keys, unwanted) {
    return unwanted.length ? pFilter.call(keys, function (key) {
      return pIndexOf.call(unwanted, key) < 0;
    }) : keys;
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
  function baseDeepEqual(actual, expected, strict, previousStack) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    }
    if (isBuffer(actual) && isBuffer(expected)) {
      return actual.length === expected.length &&
        !pSome.call(actual, function (item, index) {
          return item !== expected[index];
        });
    }

    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
    if (isDate(actual) && isDate(expected)) {
      return pGetTime.call(actual) === pGetTime.call(expected);
    }

    // 7.3 If the expected value is a RegExp object, the actual value is
    // equivalent if it is also a RegExp object with the same `source` and
    // properties (`global`, `multiline`, `lastIndex`, `ignoreCase` & `sticky`).
    if (isRegExp(actual) && isRegExp(expected)) {
      return rToString.call(actual) === rToString.call(expected) &&
        actual.lastIndex === expected.lastIndex;
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
    if (isNil(actual) || isNil(expected)) {
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
    var ka = isArguments(actual);
    var kb = isArguments(expected);
    if (ka && !kb || !ka && kb) {
      return false;
    }
    if (ka) {
      if (ka.length !== kb.length) {
        return false;
      }
      return baseDeepEqual(
        pSlice.call(actual),
        pSlice.call(expected),
        strict,
        null
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
    //the same set of keys (although not necessarily the same order),
    pSort.call(ka);
    pSort.call(kb);
    var aIsString, bIsString;
    if (hasBoxedStringBug) {
      aIsString = isString(actual);
      bIsString = isString(expected);
    }
    //~~~cheap key test
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    return !pSome.call(ka, function (key, index) {
      if (key !== kb[index]) {
        return true;
      }
      var isIdx = (aIsString || bIsString) && isIndex(key);
      var stack = previousStack ? previousStack : [actual];
      var item = getItem(actual, key, aIsString, isIdx);
      var isPrim = isPrimitive(item);
      if (!isPrim) {
        if (pIndexOf.call(stack, item) > -1) {
          throw new RangeError('Circular object');
        }
        pPush.call(stack, item);
      }
      var result = !baseDeepEqual(
        item,
        getItem(expected, key, bIsString, isIdx),
        strict,
        stack
      );
      if (!isPrim) {
        pPop.call(stack);
      }
      return result;
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
    return baseDeepEqual(actual, expected, strict);
  };
}());

},{"is-arguments":4,"is-buffer":5,"is-date-object":6,"is-error-x":7,"is-map-x":9,"is-nil-x":10,"is-object":13,"is-primitive":14,"is-regex":15,"is-set-x":16,"is-string":17}],2:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/has-symbol-support-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/has-symbol-support-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/has-symbol-support-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/has-symbol-support-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/has-symbol-support-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/has-symbol-support-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/has-symbol-support-x" title="npm version">
 * <img src="https://badge.fury.io/js/has-symbol-support-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * hasSymbolSupport module. Tests if `Symbol` exists and creates the correct
 * type.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.8
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-symbol-support-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:false, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:1, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  /**
   * Indicates if `Symbol`exists and creates the correct type.
   * `true`, if it exists and creates the correct type, otherwise `false`.
   *
   * @type boolean
   */
  module.exports = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
}());

},{}],3:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/has-to-string-tag-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/has-to-string-tag-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/has-to-string-tag-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/has-to-string-tag-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/has-to-string-tag-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/has-to-string-tag-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/has-to-string-tag-x" title="npm version">
 * <img src="https://badge.fury.io/js/has-to-string-tag-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * hasToStringTag tests if @@toStringTag is supported. `true` if supported.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.7
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-to-string-tag-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:false, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:1, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  /**
   * Indicates if `Symbol.toStringTag`exists and is the correct type.
   * `true`, if it exists and is the correct type, otherwise `false`.
   *
   * @type boolean
   */
  module.exports = _dereq_('has-symbol-support-x') &&
    typeof Symbol.toStringTag === 'symbol';
}());

},{"has-symbol-support-x":2}],4:[function(_dereq_,module,exports){
'use strict';

var toStr = Object.prototype.toString;

var isStandardArguments = function isArguments(value) {
	return toStr.call(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		toStr.call(value) !== '[object Array]' &&
		toStr.call(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{}],5:[function(_dereq_,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(obj != null &&
    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
      (obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj))
    ))
}

},{}],6:[function(_dereq_,module,exports){
'use strict';

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) { return false; }
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

},{}],7:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-error-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-error-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-error-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-error-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-error-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-error-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-error-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-error-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isError module. Detect whether a value is an error.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.10
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-error-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:10, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var toStringTag = _dereq_('to-string-tag-x');
  var isObjectLike = _dereq_('is-object-like');
  var $getPrototypeOf = Object.getPrototypeOf;
  var errorCheck = function checkIfError(value) {
    return toStringTag(value) === '[object Error]';
  };

  if (!errorCheck(Error.prototype)) {
    var errorProto = Error.prototype;
    var testStringTag = errorCheck;
    errorCheck = function checkIfError(value) {
      return value === errorProto || testStringTag(value);
    };
  }

  /**
   * Determine whether or not a given `value` is an `Error` type.
   *
   * @param {*} value The object to be tested.
   * @return {boolean} Returns `true` if `value` is an `Error` type,
   *  else `false`.
   * @example
   * var isError = require('is-error-x');
   *
   * isError(); // false
   * isError(Number.MIN_VALUE); // false
   * isError('abc'); // false
   * isError(new Error()); //true
   */
  module.exports = function isError(value) {
    if (!isObjectLike(value)) {
      return false;
    }
    var object = value;
    var maxLoop = 100;
    while (object && maxLoop > -1) {
      if (errorCheck(object)) {
        return true;
      }
      object = $getPrototypeOf(object);
      maxLoop -= 1;
    }
    return false;
  };
}());

},{"is-object-like":12,"to-string-tag-x":19}],8:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-function-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/is-function-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-function-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-function-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-function-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-function-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-function-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-function-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isFunction module. Determine whether a given value is a function object.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.3
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-function-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var fToString = Function.prototype.toString;
  var toStringTag = _dereq_('to-string-tag-x');
  var hasToStringTag = _dereq_('has-to-string-tag-x');
  var isPrimitive = _dereq_('is-primitive');
  var funcTag = '[object Function]';
  var genTag = '[object GeneratorFunction]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @private
   * @param {*} value The value to check.
   * @return {boolean} Returns `true` if `value` is correctly classified,
   * else `false`.
   */
  function tryFunctionObject(value) {
    try {
      fToString.call(value);
      return true;
    } catch (ignore) {}
    return false;
  }

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @param {*} value The value to check.
   * @return {boolean} Returns `true` if `value` is correctly classified,
   * else `false`.
   * @example
   * var isFunction = require('is-function-x');
   *
   * isFunction(); // false
   * isFunction(Number.MIN_VALUE); // false
   * isFunction('abc'); // false
   * isFunction(true); // false
   * isFunction({ name: 'abc' }); // false
   * isFunction(function () {}); // true
   * isFunction(new Function ()); // true
   * isFunction(function* test1() {}); // true
   * isFunction(function test2(a, b) {}); // true
   * isFunction(class Test {}); // true
   * isFunction((x, y) => {return this;}); // true
   */
  module.exports = function isFunction(value) {
    if (isPrimitive(value)) {
      return false;
    }
    if (hasToStringTag) {
      return tryFunctionObject(value);
    }
    var strTag = toStringTag(value);
    return strTag === funcTag || strTag === genTag;
  };
}());

},{"has-to-string-tag-x":3,"is-primitive":14,"to-string-tag-x":19}],9:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-map-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-map-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-map-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-map-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-map-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-map-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-map-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-map-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isMap module. Detect whether or not an object is an ES6 Map.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.10
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-map-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var isObjectLike, getSize;

  if (typeof Map === 'function') {
    try {
      getSize = Object.getOwnPropertyDescriptor(Map.prototype, 'size').get;
      getSize = typeof getSize.call(new Map()) === 'number' && getSize;
      isObjectLike = _dereq_('is-object-like-x');
    } catch (ignore) {
      getSize = null;
    }
  }

  /**
   * Determine if an `object` is a `Map`.
   *
   * @param {*} object The object to test.
   * @return {boolean} `true` if the `object` is a `Map`,
   *  else false`
   * @example
   * var isMap = require('is-map-x');
   * var m = new Map();
   *
   * isMap([]); // false
   * isMap(true); // false
   * isMap(m); // true
   */
  module.exports = function isMap(object) {
    if (!getSize || !isObjectLike(object)) {
      return false;
    }
    try {
      return typeof getSize.call(object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"is-object-like-x":11}],10:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-nil-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-nil-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-nil-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-nil-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-nil-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-nil-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-nil-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-nil-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isNil module.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.7
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-nil-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:3, maxcomplexity:2 */

/*global module */

;(function () {
  'use strict';

  var isUndefined = _dereq_('validate.io-undefined');
  var isNull = _dereq_('lodash.isnull');

  /**
   * Checks if `value` is `null` or `undefined`.
   *
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
   * @example
   *
   * _.isNil(null);
   * // => true
   *
   * _.isNil(void 0);
   * // => true
   *
   * _.isNil(NaN);
   * // => false
   */
  module.exports = function isNil(value) {
    return isNull(value) || isUndefined(value);
  };
}());

},{"lodash.isnull":18,"validate.io-undefined":20}],11:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-object-like-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-object-like-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-object-like-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-object-like-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-object-like-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-object-like-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-object-like-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-object-like-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * ES6 isObjectLike module.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.8
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-object-like-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:3, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  var isFunction = _dereq_('is-function-x');
  var isPrimitive = _dereq_('is-primitive');

  /**
   * Checks if `value` is object-like. A value is object-like if it's not a
   * primitive and not a function.
   *
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   * var isObjectLike = require('is-object-like-x');
   *
   * isObjectLike({});
   * // => true
   *
   * isObjectLike([1, 2, 3]);
   * // => true
   *
   * isObjectLike(_.noop);
   * // => false
   *
   * isObjectLike(null);
   * // => false
   */
  module.exports = function isObjectLike(value) {
    return !isPrimitive(value) && !isFunction(value);
  };
}());

},{"is-function-x":8,"is-primitive":14}],12:[function(_dereq_,module,exports){
'use strict'

module.exports = function isObjectLike (value) {
  return (typeof value === 'object' || typeof value === 'function') && value !== null
}

},{}],13:[function(_dereq_,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],14:[function(_dereq_,module,exports){
/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

// see http://jsperf.com/testing-value-is-primitive/7
module.exports = function isPrimitive(value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object');
};

},{}],15:[function(_dereq_,module,exports){
'use strict';

var regexExec = RegExp.prototype.exec;
var tryRegexExec = function tryRegexExec(value) {
	try {
		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isRegex(value) {
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryRegexExec(value) : toStr.call(value) === regexClass;
};

},{}],16:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-set-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-set-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-set-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-set-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-set-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-set-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-set-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-set-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isSet module. Detect whether or not an object is an ES6 SET.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.8
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-set-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var isObjectLike, getSize;

  if (typeof Set === 'function') {
    try {
      getSize = Object.getOwnPropertyDescriptor(Set.prototype, 'size').get;
      getSize = typeof getSize.call(new Set()) === 'number' && getSize;
      isObjectLike = _dereq_('is-object-like-x');
    } catch (ignore) {
      getSize = null;
    }
  }

  /**
   * Determine if an `object` is a `Set`.
   *
   * @param {*} object The object to test.
   * @return {boolean} `true` if the `object` is a `Set`,
   *  else false`
   * @example
   * var isSet = require('is-set-x');
   * var s = new Set();
   *
   * isSet([]); // false
   * isSet(true); // false
   * isSet(s); // true
   */
  module.exports = function isSet(object) {
    if (!getSize || !isObjectLike(object)) {
      return false;
    }
    try {
      return typeof getSize.call(object) === 'number';
    } catch (ignore) {}

    return false;
  };
}());

},{"is-object-like-x":11}],17:[function(_dereq_,module,exports){
'use strict';

var strValue = String.prototype.valueOf;
var tryStringObject = function tryStringObject(value) {
	try {
		strValue.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var strClass = '[object String]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isString(value) {
	if (typeof value === 'string') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
};

},{}],18:[function(_dereq_,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;

},{}],19:[function(_dereq_,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/to-string-tag-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/to-string-tag-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/to-string-tag-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/to-string-tag-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/to-string-tag-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/to-string-tag-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/to-string-tag-x" title="npm version">
 * <img src="https://badge.fury.io/js/to-string-tag-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * Get an object's @@toStringTag. Includes fixes to correct ES3 differences
 * for the following.
 * - undefined => '[object Undefined]'
 * - null => '[object Null]'
 *
 * No other fixes are included, so legacy `arguments` will
 * give `[object Object]`, and many older native objects
 * give `[object Object]`. There are also other environmental bugs
 * for example `RegExp` gives `[object Function]` and `Uint8Array`
 * gives `[object Object]` on certain engines. While these and more could
 * be fixed, it was decided that this should be a very raw version and it
 * is left to the coder to use other `is` implimentations for detection.
 * It is also worth noting that as of ES6 `Symbol.toStringTag` can be set on
 * an object and therefore can report any string that it wishes.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.8
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-string-tag-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:6, maxcomplexity:3 */

/*global module */

;(function () {
  'use strict';

  var pToString = Object.prototype.toString;
  var isNull = _dereq_('lodash.isnull');
  var isUndefined = _dereq_('validate.io-undefined');
  var nullTag = '[object Null]';
  var undefTag = '[object Undefined]';

  /**
   * The `toStringTag` method returns "[object type]", where type is the
   * object type.
   *
   * @param {*} value The object of which to get the object type string.
   * @return {string} The object type string.
   * @example
   * var o = new Object();
   *
   * toStringTag(o); // returns '[object Object]'
   */
  module.exports = function toStringTag(value) {
    if (isNull(value)) {
      return nullTag;
    }
    if (isUndefined(value)) {
      return undefTag;
    }
    return pToString.call(value);
  };
}());

},{"lodash.isnull":18,"validate.io-undefined":20}],20:[function(_dereq_,module,exports){
/**
*
*	VALIDATE: undefined
*
*
*	DESCRIPTION:
*		- Validates if a value is undefined.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

'use strict';

/**
* FUNCTION: isUndefined( value )
*	Validates if a value is undefined.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is undefined
*/
function isUndefined( value ) {
	return value === void 0;
} // end FUNCTION isUndefined()


// EXPORTS //

module.exports = isUndefined;

},{}]},{},[1])(1)
});