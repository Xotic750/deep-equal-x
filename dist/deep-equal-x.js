/*!
{
  "copywrite": "Copyright (c) 2015-2017",
  "date": "2020-01-31T11:05:20.296Z",
  "describe": "",
  "description": "node's deepEqual and deepStrictEqual algorithm.",
  "file": "deep-equal-x.js",
  "hash": "84594e3008249606b6a9",
  "license": "MIT",
  "version": "2.1.2"
}
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["deepEqualX"] = factory();
	else
		root["deepEqualX"] = factory();
})((function () {
  'use strict';

  var ObjectCtr = {}.constructor;
  var objectPrototype = ObjectCtr.prototype;
  var defineProperty = ObjectCtr.defineProperty;
  var $globalThis;
  var getGlobalFallback = function() {
    if (typeof self !== 'undefined') {
      return self;
    }

    if (typeof window !== 'undefined') {
      return window;
    }

    if (typeof global !== 'undefined') {
      return global;
    }

    return void 0;
  };

  var returnThis = function() {
    return this;
  };

  try {
    if (defineProperty) {
      defineProperty(objectPrototype, '$$globalThis$$', {
        get: returnThis,
        configurable: true
      });
    } else {
      objectPrototype.__defineGetter__('$$globalThis$$', returnThis);
    }

    $globalThis = typeof $$globalThis$$ === 'undefined' ? getGlobalFallback() : $$globalThis$$;

    delete objectPrototype.$$globalThis$$;

    return $globalThis;
  } catch (error) {
    return getGlobalFallback();
  }
}()), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;
var hasSymbols = __webpack_require__(9)();

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isRealSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};

	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') {
			return true;
		}
		if (toStr.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {

	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return  false && false;
	};
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var toStr = Object.prototype.toString;

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

//! stable.js 0.1.8, https://github.com/Two-Screen/stable
//! © 2018 Angry Bytes and contributors. MIT licensed.

(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
}(this, (function () { 'use strict';

  // A stable array sort, because `Array#sort()` is not guaranteed stable.
  // This is an implementation of merge sort, without recursion.

  var stable = function (arr, comp) {
    return exec(arr.slice(), comp)
  };

  stable.inplace = function (arr, comp) {
    var result = exec(arr, comp);

    // This simply copies back if the result isn't in the original array,
    // which happens on an odd number of passes.
    if (result !== arr) {
      pass(result, null, arr.length, arr);
    }

    return arr
  };

  // Execute the sort using the input array and a second buffer as work space.
  // Returns one of those two, containing the final result.
  function exec(arr, comp) {
    if (typeof(comp) !== 'function') {
      comp = function (a, b) {
        return String(a).localeCompare(b)
      };
    }

    // Short-circuit when there's nothing to sort.
    var len = arr.length;
    if (len <= 1) {
      return arr
    }

    // Rather than dividing input, simply iterate chunks of 1, 2, 4, 8, etc.
    // Chunks are the size of the left or right hand in merge sort.
    // Stop when the left-hand covers all of the array.
    var buffer = new Array(len);
    for (var chk = 1; chk < len; chk *= 2) {
      pass(arr, comp, chk, buffer);

      var tmp = arr;
      arr = buffer;
      buffer = tmp;
    }

    return arr
  }

  // Run a single pass with the given chunk size.
  var pass = function (arr, comp, chk, result) {
    var len = arr.length;
    var i = 0;
    // Step size / double chunk size.
    var dbl = chk * 2;
    // Bounds of the left and right chunks.
    var l, r, e;
    // Iterators over the left and right chunk.
    var li, ri;

    // Iterate over pairs of chunks.
    for (l = 0; l < len; l += dbl) {
      r = l + chk;
      e = r + chk;
      if (r > len) r = len;
      if (e > len) e = len;

      // Iterate both chunks in parallel.
      li = l;
      ri = r;
      while (true) {
        // Compare the chunks.
        if (li < r && ri < e) {
          // This works for a regular `sort()` compatible comparator,
          // but also for a simple comparator like: `a > b`
          if (comp(arr[li], arr[ri]) <= 0) {
            result[i++] = arr[li++];
          }
          else {
            result[i++] = arr[ri++];
          }
        }
        // Nothing to compare, just flush what's left.
        else if (li < r) {
          result[i++] = arr[li++];
        }
        else if (ri < e) {
          result[i++] = arr[ri++];
        }
        // Both iterators are at the chunk ends.
        else {
          break
        }
      }
    }
  };

  return stable;

})));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var slice = Array.prototype.slice;
var isArgs = __webpack_require__(7);

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) { return origKeys(o); } : __webpack_require__(12);

var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var origSymbol = global.Symbol;
var hasSymbolSham = __webpack_require__(11);

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(10)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint complexity: [2, 17], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keysShim;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var isArgs = __webpack_require__(7); // eslint-disable-line global-require
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
module.exports = keysShim;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/is-date-object/index.js
var is_date_object = __webpack_require__(3);
var is_date_object_default = /*#__PURE__*/__webpack_require__.n(is_date_object);

// EXTERNAL MODULE: ./node_modules/is-arguments/index.js
var is_arguments = __webpack_require__(2);
var is_arguments_default = /*#__PURE__*/__webpack_require__.n(is_arguments);

// CONCATENATED MODULE: ./node_modules/is-primitive-x/dist/is-primitive-x.esm.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Returns true if the value is a primitive.
 *
 * @param {*} [val] - The value to test.
 * @returns {boolean} True if a primitive, otherwise false..
 */
var isPrimitive = function isPrimitive(val) {
  return _typeof(val) === 'object' ? val === null : typeof val !== 'function';
};

/* harmony default export */ var is_primitive_x_esm = (isPrimitive);


// EXTERNAL MODULE: ./node_modules/is-object/index.js
var is_object = __webpack_require__(4);
var is_object_default = /*#__PURE__*/__webpack_require__.n(is_object);

// EXTERNAL MODULE: ./node_modules/is-buffer/index.js
var is_buffer = __webpack_require__(5);
var is_buffer_default = /*#__PURE__*/__webpack_require__.n(is_buffer);

// EXTERNAL MODULE: ./node_modules/is-string/index.js
var is_string = __webpack_require__(0);
var is_string_default = /*#__PURE__*/__webpack_require__.n(is_string);

// CONCATENATED MODULE: ./node_modules/has-boxed-string-x/dist/has-boxed-string-x.esm.js
var has_boxed_string_x_esm_string = 'a';
var boxedString = {}.constructor(has_boxed_string_x_esm_string);
/**
 * Check failure of by-index access of string characters (IE < 9)
 * and failure of `0 in boxedString` (Rhino).
 *
 * `true` if no failure; otherwise `false`.
 *
 * @type boolean
 */

var hasBoxed = boxedString[0] === has_boxed_string_x_esm_string && 0 in boxedString;
/* harmony default export */ var has_boxed_string_x_esm = (hasBoxed);


// CONCATENATED MODULE: ./node_modules/noop-x/dist/noop-x.esm.js
/**
 * This method returns undefined.
 *
 * @returns {undefined} Always undefined.
 */
var noop = function noop() {};
/* eslint-disable-line lodash/prefer-noop */


/* harmony default export */ var noop_x_esm = (noop);


// CONCATENATED MODULE: ./node_modules/has-working-bind-x/dist/has-working-bind-x.esm.js

var has_working_bind_x_esm_bind = noop_x_esm.bind;

var has_working_bind_x_esm_test1 = function test1() {
  var a1 = null;
  var a2 = null;
  var context = null;
  var testThis = [];

  var test1Fn = function test1Fn(arg1, arg2) {
    /* eslint-disable-next-line babel/no-invalid-this */
    context = this;
    a1 = arg1;
    a2 = arg2;
    /* eslint-disable-next-line prefer-rest-params */

    return arguments;
  };

  try {
    var boundFn = has_working_bind_x_esm_bind.apply(test1Fn, [testThis, 1]);
    var args = boundFn(2);
    return boundFn.length === 1 && args.length === 2 && a1 === 1 && a2 === 2 && context === testThis;
  } catch (e) {
    return false;
  }
};

var has_working_bind_x_esm_test2 = function test2() {
  var a1 = null;
  var a2 = null;
  var context = null;
  var oracle = [1, 2, 3];

  var Ctr = function Ctr(arg1, arg2) {
    a1 = arg1;
    a2 = arg2;
    context = this;
    return oracle;
  };

  try {
    var BoundFn = has_working_bind_x_esm_bind.apply(Ctr, [null]);
    var returned = new BoundFn(1, 2);
    return BoundFn.length === Ctr.length && returned === oracle && a1 === 1 && a2 === 2 && context !== oracle;
  } catch (e) {
    return false;
  }
};
/**
 * Indicates if the engine has a working bind function.
 *
 * @type {boolean}
 */


var isWorking = typeof has_working_bind_x_esm_bind === 'function' && has_working_bind_x_esm_test1() && has_working_bind_x_esm_test2();
/* harmony default export */ var has_working_bind_x_esm = (isWorking);


// CONCATENATED MODULE: ./node_modules/util-pusher-x/dist/util-pusher-x.esm.js




var EMPTY_STRING = '';
var split = EMPTY_STRING.split;
var util_pusher_x_esm_max = Math.max;
var util_pusher_x_esm_bind = is_primitive_x_esm.bind,
    util_pusher_x_esm_call = is_primitive_x_esm.call;
var stringSplit = function stringSplit(string, pattern) {
  // noinspection JSUnresolvedFunction
  return split.call(string, pattern);
};
var $split = has_working_bind_x_esm ? util_pusher_x_esm_bind.call(util_pusher_x_esm_call, split) : stringSplit;
var util_pusher_x_esm_getIterable = function getIterable(arrayLike) {
  // noinspection JSUnresolvedFunction
  return is_string_default()(arrayLike) ? $split(arrayLike, EMPTY_STRING) : arrayLike;
}; // eslint-disable jsdoc/no-undefined-types
// noinspection JSCommentMatchesSignature

/**
 * This pushes or concatenates into a new or existing array.
 *
 * @param {Array} arrayLike - The source.
 * @param {number} [from=0] - The from source index.
 * @param {Array} [target=[]] - The target array.
 * @returns {*} The target array.
 */
// eslint-enable jsdoc/no-undefined-types

var util_pusher_x_esm_pusher = function pusher(arrayLike, from) {
  /* eslint-disable-next-line prefer-rest-params */
  var target = arguments.length > 2 ? arguments[2] : [];

  if (typeof arrayLike !== 'string' && is_primitive_x_esm(arrayLike)) {
    return target;
  }

  var iterable = has_boxed_string_x_esm ? arrayLike : util_pusher_x_esm_getIterable(arrayLike);
  var length = iterable.length;

  for (var i = util_pusher_x_esm_max(0, from) || 0; i < length; i += 1) {
    target[target.length] = arrayLike[i];
  }

  return target;
};

/* harmony default export */ var util_pusher_x_esm = (util_pusher_x_esm_pusher);


// CONCATENATED MODULE: ./node_modules/simple-bind-x/dist/simple-bind-x.esm.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var nativeBind = util_pusher_x_esm.bind,
    simple_bind_x_esm_call = util_pusher_x_esm.call;
var ERROR_MESSAGE = 'bind called on incompatible ';
var simple_bind_x_esm_object = {};
var ObjectCtr = simple_bind_x_esm_object.constructor;
var toStringTag = simple_bind_x_esm_object.toString;
var funcType = '[object Function]';
var ZERO = 0;
var argsOffset = 2;

var getMax = function getMax(a, b) {
  return a >= b ? a : b;
};

var simple_bind_x_esm_assertIsFunction = function assertIsFunction(value) {
  if (typeof value !== 'function' && toStringTag.apply(value) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + value);
  }
};

var boundFns = [function zero(binder) {
  return function boundFn() {
    /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
    return binder.apply(this, util_pusher_x_esm(arguments));
  };
}, function one(binder, boundLength) {
  return function boundFn(a) {
    /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
    return binder.apply(this, util_pusher_x_esm(arguments, boundLength, [a]));
  };
}, function two(binder, boundLength) {
  return function boundFn(a, b) {
    /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
    return binder.apply(this, util_pusher_x_esm(arguments, boundLength, [a, b]));
  };
}, function three(binder, boundLength) {
  /* eslint-disable-next-line max-params */
  return function boundFn(a, b, c) {
    /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
    return binder.apply(this, util_pusher_x_esm(arguments, boundLength, [a, b, c]));
  };
}, function four(binder, boundLength) {
  /* eslint-disable-next-line max-params */
  return function boundFn(a, b, c, d) {
    /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
    return binder.apply(this, util_pusher_x_esm(arguments, boundLength, [a, b, c, d]));
  };
}, function five(binder, boundLength) {
  /* eslint-disable-next-line max-params */
  return function boundFn(a, b, c, d, e) {
    /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
    return binder.apply(this, util_pusher_x_esm(arguments, boundLength, [a, b, c, d, e]));
  };
}, function six(binder, boundLength) {
  /* eslint-disable-next-line max-params */
  return function boundFn(a, b, c, d, e, f) {
    /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
    return binder.apply(this, util_pusher_x_esm(arguments, boundLength, [a, b, c, d, e, f]));
  };
}, function seven(binder, boundLength) {
  /* eslint-disable-next-line max-params */
  return function boundFn(a, b, c, d, e, f, g) {
    /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
    return binder.apply(this, util_pusher_x_esm(arguments, boundLength, [a, b, c, d, e, f, g]));
  };
}, function eight(binder, boundLength) {
  /* eslint-disable-next-line max-params */
  return function boundFn(a, b, c, d, e, f, g, h) {
    /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
    return binder.apply(this, util_pusher_x_esm(arguments, boundLength, [a, b, c, d, e, f, g, h]));
  };
}];

var getBoundFn = function getBoundFn(args) {
  var _args = _slicedToArray(args, 3),
      binder = _args[0],
      target = _args[1],
      bindArgs = _args[2];

  var boundLength = getMax(ZERO, target.length - getMax(ZERO, bindArgs.length - argsOffset));
  var fn = boundFns[boundLength];
  var boundFn = fn ? fn(binder, boundLength) : boundFns[ZERO](binder);

  if (target.prototype) {
    /* eslint-disable-next-line lodash/prefer-noop */
    var Empty = function Empty() {};

    Empty.prototype = target.prototype;
    boundFn.prototype = new Empty();
    Empty.prototype = null;
  }

  return boundFn;
};

var simple_bind_x_esm_getResult = function getResult(target, boundArgs) {
  /* eslint-disable-next-line babel/no-invalid-this */
  var result = target.apply(this, boundArgs);
  /* eslint-disable-next-line babel/no-invalid-this,babel/new-cap */

  return ObjectCtr(result) === result ? result : this;
};

var implementation = function bind(target, thisArg) {
  simple_bind_x_esm_assertIsFunction(target);
  /* eslint-disable-next-line prefer-rest-params */

  var bindArgs = arguments;
  var bound;

  var binder = function binder() {
    /* eslint-disable-next-line prefer-rest-params */
    var boundArgs = util_pusher_x_esm(arguments, ZERO, util_pusher_x_esm(bindArgs, argsOffset));
    /* eslint-disable-next-line babel/no-invalid-this */

    return this instanceof bound ? simple_bind_x_esm_getResult.apply(this, [target, boundArgs]) : target.apply(thisArg, boundArgs);
  };

  bound = getBoundFn([binder, target, bindArgs]);
  return bound;
};
/**
 * The bind() method creates a new function that, when called, has its this
 * keyword set to the provided value, with a given sequence of arguments
 * preceding any provided when the new function is called.
 *
 * @function bind
 * @param {Function} target - The target function.
 * @param {*} [thisArg] - The value to be passed as the this parameter to the target
 *  function when the bound function is called. The value is ignored if the
 *  bound function is constructed using the new operator.
 * @param {...*} [args] - Arguments to prepend to arguments provided to the bound
 *  function when invoking the target function.
 * @throws {TypeError} If target is not a function.
 * @returns {Function} The bound function.
 */

var $bind = has_working_bind_x_esm ? simple_bind_x_esm_call.bind(nativeBind) : implementation;
/* harmony default export */ var simple_bind_x_esm = ($bind);


// CONCATENATED MODULE: ./node_modules/simple-call-x/dist/simple-call-x.esm.js


var $TypeError = TypeError;
var nativeApply = simple_bind_x_esm.apply,
    nativeCall = simple_bind_x_esm.call;
var $apply = simple_bind_x_esm(nativeCall, nativeApply);
var simple_call_x_esm_toStringTag = simple_bind_x_esm(nativeApply, {}.toString);
var simple_call_x_esm_ERROR_MESSAGE = ' is not a function';
var simple_call_x_esm_funcType = '[object Function]';

var simple_call_x_esm_assertIsFunction = function assertIsFunction(value) {
  if (typeof value !== 'function' && simple_call_x_esm_toStringTag(value) !== simple_call_x_esm_funcType) {
    throw new $TypeError(value + simple_call_x_esm_ERROR_MESSAGE);
  }

  return value;
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * The abstract operation Call is used to call the [[Call]] internal method of a function object.
 *
 * @function call
 * @param {Function} F - The target function.
 * @param {*} [V] - The context.
 * @param {Array} [args] - Argument to call the function with.
 * @throws {TypeError} If target is not a function.
 * @returns {*} The the result of invoking the function.
 * @see https://www.ecma-international.org/ecma-262/6.0/#sec-call
 */
// eslint-enable jsdoc/check-param-names


var simple_call_x_esm_call = function call(F, V) {
  /* eslint-disable-next-line prefer-rest-params */
  return $apply(simple_call_x_esm_assertIsFunction(F), V, util_pusher_x_esm(arguments[2]));
};

/* harmony default export */ var simple_call_x_esm = (simple_call_x_esm_call);


// CONCATENATED MODULE: ./node_modules/simple-methodize-x/dist/simple-methodize-x.esm.js


var simple_methodize_x_esm_toStringTag = {}.toString;
var simple_methodize_x_esm_ERROR_MESSAGE = 'methodize called on incompatible ';
var simple_methodize_x_esm_funcType = '[object Function]';

var simple_methodize_x_esm_assertIsFunction = function assertIsFunction(value) {
  if (typeof value !== 'function' && simple_call_x_esm(simple_methodize_x_esm_toStringTag, value) !== simple_methodize_x_esm_funcType) {
    throw new TypeError(simple_methodize_x_esm_ERROR_MESSAGE + value);
  }

  return value;
};
/**
 * Methodize a prototype method. Compliant to 8 arguments.
 *
 * @param {Function} prototypeMethod - The prototype method to methodize.
 * @throws {TypeError} If target is not a function.
 * @returns {Function} The static method.
 */


var simple_methodize_x_esm_methodize = function methodize(prototypeMethod) {
  simple_methodize_x_esm_assertIsFunction(prototypeMethod);
  return function methodized() {
    /* eslint-disable-next-line prefer-rest-params */
    return simple_call_x_esm(prototypeMethod, arguments[0], util_pusher_x_esm(arguments, 1));
  };
};

/* harmony default export */ var simple_methodize_x_esm = (simple_methodize_x_esm_methodize);


// CONCATENATED MODULE: ./node_modules/to-string-tag-x/dist/to-string-tag-x.esm.js

var methodizedToString = simple_methodize_x_esm({}.toString);
/**
 * The `toStringTag` method returns "[object type]", where type is the
 * object type.
 *
 * @param {*} [value] - The object of which to get the object type string.
 * @returns {string} The object type string.
 */

var to_string_tag_x_esm_toStringTag = function toStringTag(value) {
  if (value === null) {
    return '[object Null]';
  }

  if (typeof value === 'undefined') {
    return '[object Undefined]';
  }

  return methodizedToString(value);
};

/* harmony default export */ var to_string_tag_x_esm = (to_string_tag_x_esm_toStringTag);


// CONCATENATED MODULE: ./node_modules/attempt-x/dist/attempt-x.esm.js

 // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method attempts to invoke the function, returning either the result or
 * the caught error object. Any additional arguments are provided to the
 * function when it's invoked.
 *
 * @function attempt
 * @param {Function} [fn] - The function to attempt.
 * @param {...*} [args] - The arguments to invoke the function with.
 * @returns {object} Returns an object of the result.
 */
// eslint-disable jsdoc/check-param-names

var attempt_x_esm_attempt = function attempt(fn) {
  try {
    return {
      threw: false,

      /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
      value: simple_call_x_esm(fn, this, util_pusher_x_esm(arguments, 1))
    };
  } catch (e) {
    return {
      threw: true,
      value: e
    };
  }
};

/* harmony default export */ var attempt_x_esm = (attempt_x_esm_attempt);


// CONCATENATED MODULE: ./node_modules/to-boolean-x/dist/to-boolean-x.esm.js
/**
 * The abstract operation ToBoolean converts argument to a value of type Boolean.
 *
 * @param {*} [value] - The value to be converted.
 * @returns {boolean} 'true' if value is truthy; otherwise 'false'.
 */
var toBoolean = function toBoolean(value) {
  return !!value;
};

/* harmony default export */ var to_boolean_x_esm = (toBoolean);


// EXTERNAL MODULE: ./node_modules/is-symbol/index.js
var is_symbol = __webpack_require__(1);
var is_symbol_default = /*#__PURE__*/__webpack_require__.n(is_symbol);

// CONCATENATED MODULE: ./node_modules/has-symbol-support-x/dist/has-symbol-support-x.esm.js
var has_symbol_support_x_esm_this = undefined;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }



var hasSymbolSupport = attempt_x_esm(function () {
  _newArrowCheck(this, has_symbol_support_x_esm_this);

  /* eslint-disable-next-line compat/compat */
  return typeof Symbol === 'function' && is_symbol_default()(Symbol(''));
}.bind(undefined));
/**
 * Indicates if `Symbol`exists and creates the correct type.
 * `true`, if it exists and creates the correct type, otherwise `false`.
 *
 * @type boolean
 */

/* harmony default export */ var has_symbol_support_x_esm = (hasSymbolSupport.threw === false && hasSymbolSupport.value === true);


// CONCATENATED MODULE: ./node_modules/has-to-string-tag-x/dist/has-to-string-tag-x.esm.js


/**
 * Indicates if `Symbol.toStringTag`exists and is the correct type.
 * `true`, if it exists and is the correct type, otherwise `false`.
 *
 * @type boolean
 */

/* harmony default export */ var has_to_string_tag_x_esm = (has_symbol_support_x_esm &&
/* eslint-disable-next-line compat/compat */
is_symbol_default()(Symbol.toStringTag));


// CONCATENATED MODULE: ./node_modules/is-nil-x/dist/is-nil-x.esm.js
/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @param {*} [value] - The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 */
var isNil = function isNil(value) {
  /* eslint-disable-next-line lodash/prefer-is-nil */
  return value === null || typeof value === 'undefined';
};

/* harmony default export */ var is_nil_x_esm = (isNil);


// CONCATENATED MODULE: ./node_modules/require-object-coercible-x/dist/require-object-coercible-x.esm.js

/**
 * The abstract operation RequireObjectCoercible throws an error if argument
 * is a value that cannot be converted to an Object using ToObject.
 *
 * @param {*} [value] - The `value` to check.
 * @throws {TypeError} If `value` is a `null` or `undefined`.
 * @returns {string} The `value`.
 */

var require_object_coercible_x_esm_requireObjectCoercible = function requireObjectCoercible(value) {
  if (is_nil_x_esm(value)) {
    throw new TypeError("Cannot call method on ".concat(value));
  }

  return value;
};

/* harmony default export */ var require_object_coercible_x_esm = (require_object_coercible_x_esm_requireObjectCoercible);


// CONCATENATED MODULE: ./node_modules/to-string-x/dist/to-string-x.esm.js

var to_string_x_esm_ERROR_MESSAGE = 'Cannot convert a Symbol value to a string';
var castString = to_string_x_esm_ERROR_MESSAGE.constructor;
/**
 * The abstract operation ToString converts argument to a value of type String.
 *
 * @param {*} [value] - The value to convert to a string.
 * @throws {TypeError} If `value` is a Symbol.
 * @returns {string} The converted value.
 */

var to_string_x_esm_ToString = function ToString(value) {
  if (is_symbol_default()(value)) {
    throw new TypeError(to_string_x_esm_ERROR_MESSAGE);
  }

  return castString(value);
};

/* harmony default export */ var to_string_x_esm = (to_string_x_esm_ToString);


// CONCATENATED MODULE: ./node_modules/require-coercible-to-string-x/dist/require-coercible-to-string-x.esm.js


/**
 * This method requires an argument is corecible then converts using ToString.
 *
 * @param {*} [value] - The value to converted to a string.
 * @throws {TypeError} If value is null or undefined.
 * @returns {string} The value as a string.
 */

var require_coercible_to_string_x_esm_requireCoercibleToString = function requireCoercibleToString(value) {
  return to_string_x_esm(require_object_coercible_x_esm(value));
};

/* harmony default export */ var require_coercible_to_string_x_esm = (require_coercible_to_string_x_esm_requireCoercibleToString);


// CONCATENATED MODULE: ./node_modules/white-space-x/dist/white-space-x.esm.js
/**
 * A record of a white space character.
 *
 * @typedef {object} CharRecord
 * @property {number} code - The character code.
 * @property {string} description - A description of the character.
 * @property {boolean} es5 - Whether the spec lists this as a white space.
 * @property {boolean} es2015 - Whether the spec lists this as a white space.
 * @property {boolean} es2016 - Whether the spec lists this as a white space.
 * @property {boolean} es2017 - Whether the spec lists this as a white space.
 * @property {boolean} es2018 - Whether the spec lists this as a white space.
 * @property {string} string - The character string.
 */

/**
 * An array of the whitespace char codes, string, descriptions and language
 * presence in the specifications.
 *
 * @type Array.<CharRecord>
 */
var list = [{
  code: 0x0009,
  description: 'Tab',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\t"
}, {
  code: 0x000a,
  description: 'Line Feed',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\n"
}, {
  code: 0x000b,
  description: 'Vertical Tab',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\x0B"
}, {
  code: 0x000c,
  description: 'Form Feed',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\f"
}, {
  code: 0x000d,
  description: 'Carriage Return',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\r"
}, {
  code: 0x0020,
  description: 'Space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: " "
},
/*
{
  code: 0x0085,
  description: 'Next line',
  es5: false,
  es2015: false,
  es2016: false,
  es2017: false,
  es2018: false,
  string: '\u0085'
}
*/
{
  code: 0x00a0,
  description: 'No-break space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\xA0"
}, {
  code: 0x1680,
  description: 'Ogham space mark',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u1680"
}, {
  code: 0x180e,
  description: 'Mongolian vowel separator',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: false,
  es2018: false,
  string: "\u180E"
}, {
  code: 0x2000,
  description: 'En quad',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2000"
}, {
  code: 0x2001,
  description: 'Em quad',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2001"
}, {
  code: 0x2002,
  description: 'En space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2002"
}, {
  code: 0x2003,
  description: 'Em space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2003"
}, {
  code: 0x2004,
  description: 'Three-per-em space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2004"
}, {
  code: 0x2005,
  description: 'Four-per-em space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2005"
}, {
  code: 0x2006,
  description: 'Six-per-em space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2006"
}, {
  code: 0x2007,
  description: 'Figure space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2007"
}, {
  code: 0x2008,
  description: 'Punctuation space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2008"
}, {
  code: 0x2009,
  description: 'Thin space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2009"
}, {
  code: 0x200a,
  description: 'Hair space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u200A"
},
/*
{
  code: 0x200b,
  description: 'Zero width space',
  es5: false,
  es2015: false,
  es2016: false,
  es2017: false,
  es2018: false,
  string: '\u200b'
},
*/
{
  code: 0x2028,
  description: 'Line separator',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2028"
}, {
  code: 0x2029,
  description: 'Paragraph separator',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u2029"
}, {
  code: 0x202f,
  description: 'Narrow no-break space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u202F"
}, {
  code: 0x205f,
  description: 'Medium mathematical space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u205F"
}, {
  code: 0x3000,
  description: 'Ideographic space',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\u3000"
}, {
  code: 0xfeff,
  description: 'Byte Order Mark',
  es5: true,
  es2015: true,
  es2016: true,
  es2017: true,
  es2018: true,
  string: "\uFEFF"
}];
/**
 * A string of the ES5 to ES2016 whitespace characters.
 *
 * @type string
 */

var stringES2016 = '';
/**
 * A string of the ES2017 to ES2018 whitespace characters.
 *
 * @type string
 */

var stringES2018 = '';
var white_space_x_esm_length = list.length;

for (var white_space_x_esm_i = 0; white_space_x_esm_i < white_space_x_esm_length; white_space_x_esm_i += 1) {
  if (list[white_space_x_esm_i].es2016) {
    stringES2016 += list[white_space_x_esm_i].string;
  }

  if (list[white_space_x_esm_i].es2018) {
    stringES2018 += list[white_space_x_esm_i].string;
  }
}

var string2018 = stringES2018;
/* harmony default export */ var white_space_x_esm = (string2018);
var string2016 = stringES2016;


// CONCATENATED MODULE: ./node_modules/trim-left-x/dist/trim-left-x.esm.js



var trim_left_x_esm_EMPTY_STRING = '';
var RegExpCtr = /none/.constructor;
var reLeft = new RegExpCtr("^[".concat(white_space_x_esm, "]+"));
var methodizedReplace = simple_methodize_x_esm(trim_left_x_esm_EMPTY_STRING.replace);
/**
 * This method removes whitespace from the start of a string. (ES2019).
 *
 * @param {string} [string] - The string to trim the left end whitespace from.
 * @throws {TypeError} If string is null or undefined or not coercible.
 * @returns {string} The left trimmed string.
 */

var trim_left_x_esm_trimStart = function trimStart(string) {
  return methodizedReplace(require_coercible_to_string_x_esm(string), reLeft, trim_left_x_esm_EMPTY_STRING);
};

/* harmony default export */ var trim_left_x_esm = (trim_left_x_esm_trimStart);


// CONCATENATED MODULE: ./node_modules/trim-right-x/dist/trim-right-x.esm.js



var trim_right_x_esm_EMPTY_STRING = '';
var trim_right_x_esm_RegExpCtr = /none/.constructor;
var reRight = new trim_right_x_esm_RegExpCtr("[".concat(white_space_x_esm, "]+$"));
var trim_right_x_esm_methodizedReplace = simple_methodize_x_esm(trim_right_x_esm_EMPTY_STRING.replace);
/**
 * This method removes whitespace from the end of a string. (ES2019).
 *
 * @param {string} [string] - The string to trim the right end whitespace from.
 * @throws {TypeError} If string is null or undefined or not coercible.
 * @returns {string} The right trimmed string.
 */

var trim_right_x_esm_trimEnd = function trimEnd(string) {
  return trim_right_x_esm_methodizedReplace(require_coercible_to_string_x_esm(string), reRight, trim_right_x_esm_EMPTY_STRING);
};

/* harmony default export */ var trim_right_x_esm = (trim_right_x_esm_trimEnd);


// CONCATENATED MODULE: ./node_modules/trim-x/dist/trim-x.esm.js


/**
 * This method removes whitespace from the start and end of a string.
 * (ES2019).
 *
 * @param {string} [string] - The string to trim the whitespace from.
 * @throws {TypeError} If string is null or undefined or not coercible.
 * @returns {string} The trimmed string.
 */

var trim_x_esm_trim = function trim(string) {
  return trim_left_x_esm(trim_right_x_esm(string));
};

/* harmony default export */ var trim_x_esm = (trim_x_esm_trim);


// CONCATENATED MODULE: ./node_modules/normalize-space-x/dist/normalize-space-x.esm.js



var SPACE = ' ';
var normalize_space_x_esm_RegExpCtr = /none/.constructor;
var reNormalize = new normalize_space_x_esm_RegExpCtr("[".concat(white_space_x_esm, "]+"), 'g');
var normalize_space_x_esm_methodizedReplace = simple_methodize_x_esm(SPACE.replace);
/**
 * This method strips leading and trailing white-space from a string,
 * replaces sequences of whitespace characters by a single space,
 * and returns the resulting string. (ES2019).
 *
 * @param {string} [string] - The string to be normalized.
 * @throws {TypeError} If string is null or undefined or not coercible.
 */

var normalize_space_x_esm_normalizeSpace = function normalizeSpace(string) {
  return normalize_space_x_esm_methodizedReplace(trim_x_esm(string), reNormalize, SPACE);
};

/* harmony default export */ var normalize_space_x_esm = (normalize_space_x_esm_normalizeSpace);


// CONCATENATED MODULE: ./node_modules/replace-comments-x/dist/replace-comments-x.esm.js



var replace_comments_x_esm_EMPTY_STRING = '';
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
var replace_comments_x_esm_methodizedReplace = simple_methodize_x_esm(replace_comments_x_esm_EMPTY_STRING.replace);
/**
 * This method replaces comments in a string.
 *
 * @param {string} [string] - The string to be stripped.
 * @param {string} [replacement=''] - The string to be used as a replacement.
 * @throws {TypeError} If string is null or undefined or not coercible.
 * @throws {TypeError} If replacement is not coercible.
 * @returns {string} The new string with the comments replaced.
 */

var replace_comments_x_esm_replaceComments = function replaceComments(string, replacement) {
  return replace_comments_x_esm_methodizedReplace(require_coercible_to_string_x_esm(string), STRIP_COMMENTS, arguments.length > 1 ? to_string_x_esm(replacement) : replace_comments_x_esm_EMPTY_STRING);
};

/* harmony default export */ var replace_comments_x_esm = (replace_comments_x_esm_replaceComments);


// CONCATENATED MODULE: ./node_modules/is-function-x/dist/is-function-x.esm.js








var FunctionCtr = attempt_x_esm.constructor;
var is_function_x_esm_SPACE = ' ';
var methodizedFunctionToString = simple_methodize_x_esm(attempt_x_esm.toString);
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var asyncTag = '[object AsyncFunction]';
var ctrRx = /^class /;
var methodizedTest = simple_methodize_x_esm(ctrRx.test);
var hasNativeClass = attempt_x_esm(function attemptee() {
  /* eslint-disable-next-line babel/new-cap */
  return FunctionCtr('"use strict"; return class My {};')();
}).threw === false;

var is_function_x_esm_testClassString = function testClassString(value) {
  return methodizedTest(ctrRx, normalize_space_x_esm(replace_comments_x_esm(methodizedFunctionToString(value), is_function_x_esm_SPACE)));
};

var isES6ClassFn = function isES6ClassFunc(value) {
  var result = attempt_x_esm(is_function_x_esm_testClassString, value);
  return result.threw === false && result.value;
};
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @private
 * @param {*} value - The value to check.
 * @param {boolean} allowClass - Whether to filter ES6 classes.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 * else `false`.
 */


var tryFuncToString = function funcToString(value, allowClass) {
  if (hasNativeClass && allowClass === false && isES6ClassFn(value)) {
    return false;
  }

  return attempt_x_esm(function attemptee() {
    return methodizedFunctionToString(value);
  }).threw === false;
};

var is_function_x_esm_compareTags = function compareTags(value) {
  var strTag = to_string_tag_x_esm(value);
  return strTag === funcTag || strTag === genTag || strTag === asyncTag;
};
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @param {*} value - The value to check.
 * @param {boolean} [allowClass=false] - Whether to filter ES6 classes.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 * else `false`.
 */


var is_function_x_esm_isFunction = function isFunction(value, allowClass) {
  if (is_primitive_x_esm(value)) {
    return false;
  }

  if (has_to_string_tag_x_esm) {
    return tryFuncToString(value, to_boolean_x_esm(allowClass));
  }

  if (hasNativeClass && to_boolean_x_esm(allowClass) === false && isES6ClassFn(value)) {
    return false;
  }

  return is_function_x_esm_compareTags(value);
};

/* harmony default export */ var is_function_x_esm = (is_function_x_esm_isFunction);


// CONCATENATED MODULE: ./node_modules/is-object-like-x/dist/is-object-like-x.esm.js


/**
 * Checks if `value` is object-like. A value is object-like if it's not a
 * primitive and not a function.
 *
 * @param {*} [value] - The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */

var is_object_like_x_esm_isObjectLike = function isObjectLike(value) {
  return is_primitive_x_esm(value) === false && is_function_x_esm(value, true) === false;
};

/* harmony default export */ var is_object_like_x_esm = (is_object_like_x_esm_isObjectLike);


// CONCATENATED MODULE: ./node_modules/to-object-x/dist/to-object-x.esm.js

var castObject = {}.constructor;
/**
 * The abstract operation ToObject converts argument to a value of
 * type Object.
 *
 * @param {*} value - The `value` to convert.
 * @throws {TypeError} If `value` is a `null` or `undefined`.
 * @returns {!object} The `value` converted to an object.
 */

var to_object_x_esm_toObject = function toObject(value) {
  return castObject(require_object_coercible_x_esm(value));
};

/* harmony default export */ var to_object_x_esm = (to_object_x_esm_toObject);


// CONCATENATED MODULE: ./node_modules/get-prototype-of-x/dist/get-prototype-of-x.esm.js



var get_prototype_of_x_esm_ObjectCtr = {}.constructor;
var nativeGetPrototypeOf = get_prototype_of_x_esm_ObjectCtr.getPrototypeOf;

var get_prototype_of_x_esm_test1 = function test1() {
  var prototypeOfCtr = {};
  /* eslint-disable-next-line lodash/prefer-noop */

  var Ctr = function Ctr() {};

  Ctr.prototype = prototypeOfCtr;
  var ctr = new Ctr();

  try {
    return nativeGetPrototypeOf(ctr) === prototypeOfCtr;
  } catch (ignore) {
    return false;
  }
};

var get_prototype_of_x_esm_isWorking = to_boolean_x_esm(nativeGetPrototypeOf) && get_prototype_of_x_esm_test1();

var patchedGetPrototypeOf = function getPrototypeOf(obj) {
  return nativeGetPrototypeOf(to_object_x_esm(obj));
};

var get_prototype_of_x_esm_implementation = function getPrototypeOf(obj) {
  var object = to_object_x_esm(obj);
  /* eslint-disable-next-line no-proto */

  var proto = object.__proto__;

  if (proto || proto === null) {
    return proto;
  }

  if (is_function_x_esm(object.constructor)) {
    return object.constructor.prototype;
  }

  if (object instanceof get_prototype_of_x_esm_ObjectCtr) {
    return get_prototype_of_x_esm_ObjectCtr.prototype;
  }

  return null;
};
/**
 * This method returns the prototype (i.e. The value of the internal [[Prototype]] property)
 * of the specified object.
 *
 * @function getPrototypeOf
 * @param {*} obj - The object whose prototype is to be returned.
 * @returns {object} The prototype of the given object. If there are no inherited properties, null is returned.
 */

var gpo = get_prototype_of_x_esm_isWorking ? patchedGetPrototypeOf : get_prototype_of_x_esm_implementation;
/* harmony default export */ var get_prototype_of_x_esm = (gpo);


// CONCATENATED MODULE: ./node_modules/is-error-x/dist/is-error-x.esm.js




var errorCheck = function checkIfError(value) {
  return to_string_tag_x_esm(value) === '[object Error]';
};

if (errorCheck(Error.prototype) === false) {
  var errorProto = Error.prototype;
  var testStringTag = errorCheck;

  errorCheck = function checkIfError(value) {
    return value === errorProto || testStringTag(value);
  };
}
/**
 * Determine whether or not a given `value` is an `Error` type.
 *
 * @param {*} value - The object to be tested.
 * @returns {boolean} Returns `true` if `value` is an `Error` type,
 *  else `false`.
 */


var is_error_x_esm_isError = function isError(value) {
  if (is_object_like_x_esm(value) === false) {
    return false;
  }

  var object = value;
  var maxLoop = 100;

  while (object && maxLoop > -1) {
    if (errorCheck(object)) {
      return true;
    }

    object = get_prototype_of_x_esm(object);
    maxLoop -= 1;
  }

  return false;
};

/* harmony default export */ var is_error_x_esm = (is_error_x_esm_isError);


// CONCATENATED MODULE: ./node_modules/is-nan-x/dist/is-nan-x.esm.js
/**
 * This method determines whether the passed value is NaN and its type is
 * `Number`. It is a more robust version of the original, global isNaN().
 *
 * @param {*} [value] - The value to be tested for NaN.
 * @returns {boolean} `true` if the given value is NaN and its type is Number;
 *  otherwise, `false`.
 */
var is_nan_x_esm_isNaN = function isNaN(value) {
  /* eslint-disable-next-line no-self-compare */
  return value !== value;
};

/* harmony default export */ var is_nan_x_esm = (is_nan_x_esm_isNaN);


// CONCATENATED MODULE: ./node_modules/infinity-x/dist/infinity-x.esm.js
/**
 * The constant value Infinity derived mathematically by 1 / 0.
 *
 * @type number
 */
var constantInfinity = 1 / 0;
/* harmony default export */ var infinity_x_esm = (constantInfinity);


// CONCATENATED MODULE: ./node_modules/is-finite-x/dist/is-finite-x.esm.js


/**
 * This method determines whether the passed value is a finite number.
 *
 * @param {*} [number] - The value to be tested for finiteness.
 * @returns {boolean} A Boolean indicating whether or not the given value is a finite number.
 */

var is_finite_x_esm_isFinite = function isFinite(number) {
  return typeof number === 'number' && is_nan_x_esm(number) === false && number !== infinity_x_esm && number !== -infinity_x_esm;
};

/* harmony default export */ var is_finite_x_esm = (is_finite_x_esm_isFinite);


// CONCATENATED MODULE: ./node_modules/to-primitive-x/dist/to-primitive-x.esm.js








var to_primitive_x_esm_ZERO = 0;
var ONE = 1;
/* eslint-disable-next-line no-void */

var UNDEFINED = void to_primitive_x_esm_ZERO;
var NUMBER = 'number';
var STRING = 'string';
var DEFAULT = 'default';
var StringCtr = STRING.constructor;
var NumberCtr = to_primitive_x_esm_ZERO.constructor;
/* eslint-disable-next-line compat/compat */

var symToPrimitive = has_symbol_support_x_esm && Symbol.toPrimitive;
/* eslint-disable-next-line compat/compat */

var symValueOf = has_symbol_support_x_esm && Symbol.prototype.valueOf;
var toStringOrder = ['toString', 'valueOf'];
var toNumberOrder = ['valueOf', 'toString'];
var orderLength = 2;

var assertHint = function assertHint(hint) {
  if (typeof hint !== 'string' || hint !== NUMBER && hint !== STRING) {
    throw new TypeError('hint must be "string" or "number"');
  }

  return hint;
};
/**
 * @param {*} ordinary - The ordinary to convert.
 * @param {*} hint - The hint.
 * @returns {*} - The primitive.
 */


var to_primitive_x_esm_ordinaryToPrimitive = function ordinaryToPrimitive(ordinary, hint) {
  require_object_coercible_x_esm(ordinary);
  assertHint(hint);
  var methodNames = hint === STRING ? toStringOrder : toNumberOrder;

  for (var i = to_primitive_x_esm_ZERO; i < orderLength; i += ONE) {
    var method = ordinary[methodNames[i]];

    if (is_function_x_esm(method)) {
      var result = simple_call_x_esm(method, ordinary);

      if (is_primitive_x_esm(result)) {
        return result;
      }
    }
  }

  throw new TypeError('No default value');
};
/**
 * @param {*} object - The object.
 * @param {*} property - The property.
 * @returns {undefined|Function} - The method.
 */


var to_primitive_x_esm_getMethod = function getMethod(object, property) {
  var func = object[property];

  if (is_nil_x_esm(func) === false) {
    if (is_function_x_esm(func) === false) {
      throw new TypeError("".concat(func, " returned for property ").concat(property, " of object ").concat(object, " is not a function"));
    }

    return func;
  }

  return UNDEFINED;
};
/**
 * Get the hint.
 *
 * @param {*} value - The value to compare.
 * @param {boolean} supplied - Was a value supplied.
 * @returns {string} - The hint string.
 */


var getHint = function getHint(value, supplied) {
  if (supplied) {
    if (value === StringCtr) {
      return STRING;
    }

    if (value === NumberCtr) {
      return NUMBER;
    }
  }

  return DEFAULT;
};
/**
 * Get the primitive from the exotic.
 *
 * @param {*} value - The exotic.
 * @returns {*} - The primitive.
 */


var to_primitive_x_esm_getExoticToPrim = function getExoticToPrim(value) {
  if (has_symbol_support_x_esm) {
    if (symToPrimitive) {
      return to_primitive_x_esm_getMethod(value, symToPrimitive);
    }

    if (is_symbol_default()(value)) {
      return symValueOf;
    }
  }

  return UNDEFINED;
};

var to_primitive_x_esm_evalExotic = function evalExotic(obj) {
  var exoticToPrim = obj.exoticToPrim,
      input = obj.input,
      hint = obj.hint;
  var result = simple_call_x_esm(exoticToPrim, input, [hint]);

  if (is_primitive_x_esm(result)) {
    return result;
  }

  throw new TypeError('unable to convert exotic object to primitive');
};

var to_primitive_x_esm_evalPrimitive = function evalPrimitive(input, hint) {
  var newHint = hint === DEFAULT && (is_date_object_default()(input) || is_symbol_default()(input)) ? STRING : hint;
  return to_primitive_x_esm_ordinaryToPrimitive(input, newHint === DEFAULT ? NUMBER : newHint);
};
/**
 * This method converts a JavaScript object to a primitive value.
 * Note: When toPrimitive is called with no hint, then it generally behaves as
 * if the hint were Number. However, objects may over-ride this behaviour by
 * defining a @@toPrimitive method. Of the objects defined in this specification
 * only Date objects (see 20.3.4.45) and Symbol objects (see 19.4.3.4) over-ride
 * the default ToPrimitive behaviour. Date objects treat no hint as if the hint
 * were String.
 *
 * @param {*} input - The input to convert.
 * @param {Function} [preferredType] - The preferred type (String or Number).
 * @throws {TypeError} If unable to convert input to a primitive.
 * @returns {string|number} The converted input as a primitive.
 * @see {http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive}
 */


var to_primitive_x_esm_toPrimitive = function toPrimitive(input, preferredType) {
  if (is_primitive_x_esm(input)) {
    return input;
  }

  var hint = getHint(preferredType, arguments.length > ONE);
  var exoticToPrim = to_primitive_x_esm_getExoticToPrim(input);
  return typeof exoticToPrim === 'undefined' ? to_primitive_x_esm_evalPrimitive(input, hint) : to_primitive_x_esm_evalExotic({
    exoticToPrim: exoticToPrim,
    input: input,
    hint: hint
  });
};

/* harmony default export */ var to_primitive_x_esm = (to_primitive_x_esm_toPrimitive);


// CONCATENATED MODULE: ./node_modules/nan-x/dist/nan-x.esm.js
/**
 * The constant NaN derived mathematically by 0 / 0.
 *
 * @type number
 */
var constantNAN = 0 / 0;
/* harmony default export */ var nan_x_esm = (constantNAN);


// CONCATENATED MODULE: ./node_modules/parse-int-x/dist/parse-int-x.esm.js




var nativeParseInt = parseInt;
/**  @type {Function} */

var castNumber = 0 .constructor;
var BAD_CHAR = "\u180E";
var methodizedCharAt = simple_methodize_x_esm(BAD_CHAR.charAt);
var hexRegex = /^[-+]?0[xX]/;
var parse_int_x_esm_methodizedTest = simple_methodize_x_esm(hexRegex.test);
/**
 * This method parses a string argument and returns an integer of the specified
 * radix (the base in mathematical numeral systems). (ES2019).
 *
 * @param {string} [string] - The value to parse. If the string argument is not a
 *  string, then it is converted to a string (using the ToString abstract
 *  operation). Leading whitespace in the string argument is ignored.
 * @param {number} [radix] - An integer between 2 and 36 that represents the radix
 *  (the base in mathematical numeral systems) of the above mentioned string.
 *  Specify 10 for the decimal numeral system commonly used by humans. Always
 *  specify this parameter to eliminate reader confusion and to guarantee
 *  predictable behavior. Different implementations produce different results
 *  when a radix is not specified, usually defaulting the value to 10.
 * @throws {TypeError} If target is a Symbol or is not coercible.
 * @returns {number} An integer number parsed from the given string. If the first
 *  character cannot be converted to a number, NaN is returned.
 */

var parse_int_x_esm_$parseInt = function $parseInt(string, radix) {
  var str = trim_left_x_esm(to_string_x_esm(string));

  if (methodizedCharAt(str, 0) === BAD_CHAR) {
    return nan_x_esm;
  }

  return nativeParseInt(str, castNumber(radix) || (parse_int_x_esm_methodizedTest(hexRegex, str) ? 16 : 10));
};

/* harmony default export */ var parse_int_x_esm = (parse_int_x_esm_$parseInt);


// CONCATENATED MODULE: ./node_modules/to-number-x/dist/to-number-x.esm.js






var binaryRadix = 2;
var octalRadix = 8;
var testCharsCount = 2;
var to_number_x_esm_ERROR_MESSAGE = 'Cannot convert a Symbol value to a number';
var to_number_x_esm_castNumber = testCharsCount.constructor;
var methodizedStringSlice = simple_methodize_x_esm(to_number_x_esm_ERROR_MESSAGE.slice);
var binaryRegex = /^0b[01]+$/i;
var RegExpConstructor = binaryRegex.constructor; // Note that in IE 8, RegExp.prototype.test doesn't seem to exist: ie, "test" is
// an own property of regexes. wtf.

var to_number_x_esm_methodizedTest = simple_methodize_x_esm(binaryRegex.test);

var isBinary = function isBinary(value) {
  return to_number_x_esm_methodizedTest(binaryRegex, value);
};

var octalRegex = /^0o[0-7]+$/i;

var isOctal = function isOctal(value) {
  return to_number_x_esm_methodizedTest(octalRegex, value);
};

var nonWSregex = new RegExpConstructor("[\x85\u180E\u200B\uFFFE]", 'g');

var hasNonWS = function hasNonWS(value) {
  return to_number_x_esm_methodizedTest(nonWSregex, value);
};

var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;

var isInvalidHexLiteral = function isInvalidHexLiteral(value) {
  return to_number_x_esm_methodizedTest(invalidHexLiteral, value);
};

var to_number_x_esm_assertNotSymbol = function assertNotSymbol(value) {
  if (is_symbol_default()(value)) {
    throw new TypeError(to_number_x_esm_ERROR_MESSAGE);
  }

  return value;
};

var to_number_x_esm_parseBase = function parseBase(value, radix) {
  return parse_int_x_esm(methodizedStringSlice(value, testCharsCount), radix);
};

var parseString = function parseString(toNum, value) {
  if (isBinary(value)) {
    return toNum(to_number_x_esm_parseBase(value, binaryRadix));
  }

  if (isOctal(value)) {
    return toNum(to_number_x_esm_parseBase(value, octalRadix));
  }

  return null;
};

var to_number_x_esm_convertString = function convertString(toNum, value) {
  var val = parseString(toNum, value);

  if (val !== null) {
    return val;
  }

  if (hasNonWS(value) || isInvalidHexLiteral(value)) {
    return nan_x_esm;
  }

  var trimmed = trim_x_esm(value);

  if (trimmed !== value) {
    return toNum(trimmed);
  }

  return null;
};
/**
 * This method converts argument to a value of type Number. (ES2019).
 *
 * @param {*} [argument] - The argument to convert to a number.
 * @throws {TypeError} - If argument is a Symbol or not coercible.
 * @returns {*} The argument converted to a number.
 */


var to_number_x_esm_toNumber = function toNumber(argument) {
  var value = to_number_x_esm_assertNotSymbol(to_primitive_x_esm(argument, to_number_x_esm_castNumber));

  if (typeof value === 'string') {
    var val = to_number_x_esm_convertString(toNumber, value);

    if (val !== null) {
      return val;
    }
  }

  return to_number_x_esm_castNumber(value);
};

/* harmony default export */ var to_number_x_esm = (to_number_x_esm_toNumber);


// CONCATENATED MODULE: ./node_modules/math-sign-x/dist/math-sign-x.esm.js


/**
 * This method returns the sign of a number, indicating whether the number is positive,
 * negative or zero. (ES2019).
 *
 * @param {*} x - A number.
 * @returns {number} A number representing the sign of the given argument. If the argument
 * is a positive number, negative number, positive zero or negative zero, the function will
 * return 1, -1, 0 or -0 respectively. Otherwise, NaN is returned.
 */

var math_sign_x_esm_sign = function sign(x) {
  var n = to_number_x_esm(x);

  if (n === 0 || is_nan_x_esm(n)) {
    return n;
  }

  return n > 0 ? 1 : -1;
};

/* harmony default export */ var math_sign_x_esm = (math_sign_x_esm_sign);


// CONCATENATED MODULE: ./node_modules/to-integer-x/dist/to-integer-x.esm.js




var abs = Math.abs,
    floor = Math.floor;
/**
 * Converts `value` to an integer. (ES2019).
 *
 * @param {*} value - The value to convert.
 * @returns {number} Returns the converted integer.
 */

var to_integer_x_esm_toInteger = function toInteger(value) {
  var number = to_number_x_esm(value);

  if (is_nan_x_esm(number)) {
    return 0;
  }

  if (number === 0 || is_finite_x_esm(number) === false) {
    return number;
  }

  return math_sign_x_esm(number) * floor(abs(number));
};

/* harmony default export */ var to_integer_x_esm = (to_integer_x_esm_toInteger);


// CONCATENATED MODULE: ./node_modules/is-integer-x/dist/is-integer-x.esm.js


/**
 * This method determines whether the passed value is an integer.
 *
 * @param {*} value - The value to be tested for being an integer.
 * @returns {boolean} A Boolean indicating whether or not the given value is an integer.
 */

var is_integer_x_esm_isInteger = function isInteger(value) {
  return is_finite_x_esm(value) && to_integer_x_esm(value) === value;
};

/* harmony default export */ var is_integer_x_esm = (is_integer_x_esm_isInteger);


// CONCATENATED MODULE: ./node_modules/is-safe-integer-x/dist/is-safe-integer-x.esm.js

var MAX_SAFE_INTEGER = 9007199254740991;
var MIN_SAFE_INTEGER = -MAX_SAFE_INTEGER;
/**
 * This method determines whether the passed value is a safe integer.
 *
 * Can be exactly represented as an IEEE-754 double precision number, and
 * whose IEEE-754 representation cannot be the result of rounding any other
 * integer to fit the IEEE-754 representation.
 *
 * @param {*} value - The value to be tested for being a safe integer.
 * @returns {boolean} A Boolean indicating whether or not the given value is a
 *  safe integer.
 */

var is_safe_integer_x_esm_isSafeInteger = function isSafeInteger(value) {
  return is_integer_x_esm(value) && value >= MIN_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
};

/* harmony default export */ var is_safe_integer_x_esm = (is_safe_integer_x_esm_isSafeInteger);


// CONCATENATED MODULE: ./node_modules/is-length-x/dist/is-length-x.esm.js

/**
 * This method checks if `value` is a valid array-like length.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */

var is_length_x_esm_isLength = function isLength(value) {
  return is_safe_integer_x_esm(value) && value >= 0;
};

/* harmony default export */ var is_length_x_esm = (is_length_x_esm_isLength);


// CONCATENATED MODULE: ./node_modules/to-property-key-x/dist/to-property-key-x.esm.js
function to_property_key_x_esm_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { to_property_key_x_esm_typeof = function _typeof(obj) { return typeof obj; }; } else { to_property_key_x_esm_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return to_property_key_x_esm_typeof(obj); }




/**
 * This method Converts argument to a value that can be used as a property key.
 *
 * @param {*} argument - The argument to convert to a property key.
 * @throws {TypeError} If argument is not a symbol and is not coercible to a string.
 * @returns {string|symbol} The converted argument.
 */

var to_property_key_x_esm_toPropertyKey = function toPropertyKey(argument) {
  var key = to_primitive_x_esm(argument, String);
  return has_symbol_support_x_esm && to_property_key_x_esm_typeof(key) === 'symbol' ? key : to_string_x_esm(key);
};

/* harmony default export */ var to_property_key_x_esm = (to_property_key_x_esm_toPropertyKey);


// CONCATENATED MODULE: ./node_modules/has-own-property-x/dist/has-own-property-x.esm.js



var hop = simple_methodize_x_esm({}.hasOwnProperty);
/**
 * The `hasOwnProperty` method returns a boolean indicating whether
 * the `object` has the specified `property`. Does not attempt to fix known
 * issues in older browsers, but does ES6ify the method.
 *
 * @param {!object} object - The object to test.
 * @throws {TypeError} If object is null or undefined.
 * @param {string|number|symbol} property - The name or Symbol of the property to test.
 * @returns {boolean} `true` if the property is set on `object`, else `false`.
 */

var has_own_property_x_esm_hasOwnProperty = function hasOwnProperty(object, property) {
  return hop(to_object_x_esm(object), to_property_key_x_esm(property));
};

/* harmony default export */ var has_own_property_x_esm = (has_own_property_x_esm_hasOwnProperty);


// CONCATENATED MODULE: ./node_modules/to-string-symbols-supported-x/dist/to-string-symbols-supported-x.esm.js


/* eslint-disable-next-line compat/compat */

var pToString = has_symbol_support_x_esm && Symbol.prototype.toString;
var isSymbolFn = typeof pToString === 'function' && is_symbol_default.a;
/** @type {Function} */

var to_string_symbols_supported_x_esm_castString = ''.constructor;
/**
 * The abstract operation ToString converts argument to a value of type String,
 * however the specification states that if the argument is a Symbol then a
 * 'TypeError' is thrown. This version also allows Symbols be converted to
 * a string. Other uncoercible exotics will still throw though.
 *
 * @param {*} [value] - The value to convert to a string.
 * @returns {string} The converted value.
 */

var toStringSymbolsSupported = function toStringSymbolsSupported(value) {
  return isSymbolFn && isSymbolFn(value) ? pToString.call(value) : to_string_symbols_supported_x_esm_castString(value);
};

/* harmony default export */ var to_string_symbols_supported_x_esm = (toStringSymbolsSupported);


// CONCATENATED MODULE: ./node_modules/math-clamp-x/dist/math-clamp-x.esm.js


var math_clamp_x_esm_getMaxMin = function getMaxMin(args) {
  var minVal = to_number_x_esm(args[1]);
  var result = args.length < 3 ? {
    max: minVal,
    min: 0
  } : {
    max: to_number_x_esm(args[2]),
    min: minVal
  };

  if (result.min > result.max) {
    throw new RangeError('"min" must be less than "max"');
  }

  return result;
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method clamp a number to min and max limits inclusive.
 *
 * @param {number} value - The number to be clamped.
 * @param {number} [min=0] - The minimum number.
 * @param {number} max - The maximum number.
 * @throws {RangeError} If min > max.
 * @returns {number} The clamped number.
 */
// eslint-enable jsdoc/check-param-names


var math_clamp_x_esm_clamp = function clamp(value) {
  var number = to_number_x_esm(value);

  if (arguments.length < 2) {
    return number;
  }
  /* eslint-disable-next-line prefer-rest-params */


  var _getMaxMin = math_clamp_x_esm_getMaxMin(arguments),
      max = _getMaxMin.max,
      min = _getMaxMin.min;

  if (number < min) {
    return min;
  }

  if (number > max) {
    return max;
  }

  return number;
};

/* harmony default export */ var math_clamp_x_esm = (math_clamp_x_esm_clamp);


// CONCATENATED MODULE: ./node_modules/is-index-x/dist/is-index-x.esm.js




var is_index_x_esm_MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
var rxTest = reIsUint.test;
/**
 * This method determines whether the passed value is a zero based index.
 * JavaScript arrays are zero-indexed: the first element of an array is at
 * index 0, and the last element is at the index equal to the value of the
 * array's length property minus 1.
 *
 * @param {number|string} value - The value to be tested for being a zero based index.
 * @param {number} [length=MAX_SAFE_INTEGER] - The length that sets the upper bound.
 * @returns {boolean} A Boolean indicating whether or not the given value is a
 * zero based index within bounds.
 */

var is_index_x_esm_isIndex = function isIndex(value, length) {
  var string = to_string_symbols_supported_x_esm(value);

  if (rxTest.call(reIsUint, string) === false) {
    return false;
  }

  var number = to_number_x_esm(string);

  if (arguments.length > 1) {
    return number < math_clamp_x_esm(to_integer_x_esm(length), is_index_x_esm_MAX_SAFE_INTEGER);
  }

  return number < is_index_x_esm_MAX_SAFE_INTEGER;
};

/* harmony default export */ var is_index_x_esm = (is_index_x_esm_isIndex);


// CONCATENATED MODULE: ./node_modules/property-is-enumerable-x/dist/property-is-enumerable-x.esm.js



var propIsEnumerable = simple_methodize_x_esm({}.propertyIsEnumerable);
/**
 * This method returns a Boolean indicating whether the specified property is
 * enumerable. Does not attempt to fix bugs in IE<9 or old Opera, otherwise it
 * does ES6ify the method.
 *
 * @param {!object} object - The object on which to test the property.
 * @param {string|symbol} property - The name of the property to test.
 * @throws {TypeError} If target is null or undefined.
 * @returns {boolean} A Boolean indicating whether the specified property is
 *  enumerable.
 */

var property_is_enumerable_x_esm_propertyIsEnumerable = function propertyIsEnumerable(object, property) {
  return propIsEnumerable(to_object_x_esm(object), to_property_key_x_esm(property));
};

/* harmony default export */ var property_is_enumerable_x_esm = (property_is_enumerable_x_esm_propertyIsEnumerable);


// CONCATENATED MODULE: ./node_modules/object-get-own-property-descriptor-x/dist/object-get-own-property-descriptor-x.esm.js











var object_get_own_property_descriptor_x_esm_EMPTY_STRING = '';
var charAt = simple_methodize_x_esm(object_get_own_property_descriptor_x_esm_EMPTY_STRING.charAt);
var object_get_own_property_descriptor_x_esm_ObjectCtr = {}.constructor;
var ngopd = object_get_own_property_descriptor_x_esm_ObjectCtr.getOwnPropertyDescriptor;
var nativeGOPD = typeof ngopd === 'function' && ngopd;
var getOPDFallback1;
var getOPDFallback2; // ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3

var object_get_own_property_descriptor_x_esm_doesGOPDWork = function doesGOPDWork(object, prop) {
  object[to_property_key_x_esm(prop)] = 0;
  var testResult = attempt_x_esm(nativeGOPD, object, prop);
  return testResult.threw === false && testResult.value.value === 0;
};

var prototypeOfObject = object_get_own_property_descriptor_x_esm_ObjectCtr.prototype; // If JS engine supports accessors creating shortcuts.

var supportsAccessors = has_own_property_x_esm(prototypeOfObject, '__defineGetter__');
/* eslint-disable-next-line no-underscore-dangle */

var lookupGetter = supportsAccessors && simple_methodize_x_esm(prototypeOfObject.__lookupGetter__);
/* eslint-disable-next-line no-underscore-dangle */

var lookupSetter = supportsAccessors && simple_methodize_x_esm(prototypeOfObject.__lookupSetter__);
var object_get_own_property_descriptor_x_esm_implementation = function getOwnPropertyDescriptor(object, property) {
  var obj = to_object_x_esm(object);
  var propKey = to_property_key_x_esm(property);
  var result; // make a valiant attempt to use the real getOwnPropertyDescriptor for I8's DOM elements.

  if (getOPDFallback1) {
    result = attempt_x_esm(function attemptee() {
      return getOPDFallback1(to_object_x_esm(obj), propKey);
    });

    if (result.threw === false) {
      return result.value;
    } // try the shim if the real one doesn't work

  }

  var isStringIndex = is_string_default()(obj) && is_index_x_esm(propKey, obj.length);

  if (getOPDFallback2 && isStringIndex === false) {
    result = attempt_x_esm(function attemptee() {
      return getOPDFallback2(to_object_x_esm(obj), propKey);
    });

    if (result.threw === false) {
      return result.value;
    } // try the shim if the real one doesn't work

  }
  /* eslint-disable-next-line no-void */


  var descriptor = void 0; // If object does not owns property return undefined immediately.

  if (isStringIndex === false && has_own_property_x_esm(obj, propKey) === false) {
    return descriptor;
  } // If object has a property then it's for sure `configurable`, and
  // probably `enumerable`. Detect enumerability though.


  descriptor = {
    configurable: is_primitive_x_esm(object) === false && isStringIndex === false,
    enumerable: property_is_enumerable_x_esm(obj, propKey)
  }; // If JS engine supports accessor properties then property may be a
  // getter or setter.

  if (supportsAccessors) {
    // Unfortunately `__lookupGetter__` will return a getter even
    // if object has own non getter property along with a same named
    // inherited getter. To avoid misbehavior we temporary remove
    // `__proto__` so that `__lookupGetter__` will return getter only
    // if it's owned by an object.

    /* eslint-disable-next-line no-proto */
    var prototype = obj.__proto__;
    var notPrototypeOfObject = obj !== prototypeOfObject; // avoid recursion problem, breaking in Opera Mini when
    // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
    // or any other Object.prototype accessor

    if (notPrototypeOfObject) {
      /* eslint-disable-next-line no-proto */
      obj.__proto__ = prototypeOfObject;
    }

    var getter = lookupGetter(obj, propKey);
    var setter = lookupSetter(obj, propKey);

    if (notPrototypeOfObject) {
      // Once we have getter and setter we can put values back.

      /* eslint-disable-next-line no-proto */
      obj.__proto__ = prototype;
    }

    if (getter || setter) {
      if (getter) {
        descriptor.get = getter;
      }

      if (setter) {
        descriptor.set = setter;
      } // If it was accessor property we're done and return here
      // in order to avoid adding `value` to the descriptor.


      return descriptor;
    }
  } // If we got this far we know that object has an own property that is
  // not an accessor so we set it as a value and return descriptor.


  if (isStringIndex) {
    descriptor.value = charAt(obj, propKey);
    descriptor.writable = false;
  } else {
    descriptor.value = obj[propKey];
    descriptor.writable = true;
  }

  return descriptor;
};
/**
 * This method returns a property descriptor for an own property (that is,
 * one directly present on an object and not in the object's prototype chain)
 * of a given object.
 *
 * @param {*} object - The object in which to look for the property.
 * @param {*} property - The name of the property whose description is to be retrieved.
 * @returns {object} A property descriptor of the given property if it exists on the object, undefined otherwise.
 */

var $getOwnPropertyDescriptor; // check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.

if (nativeGOPD) {
  var object_get_own_property_descriptor_x_esm_doc = typeof document !== 'undefined' && document;
  var getOPDWorksOnDom = object_get_own_property_descriptor_x_esm_doc ? object_get_own_property_descriptor_x_esm_doesGOPDWork(object_get_own_property_descriptor_x_esm_doc.createElement('div'), 'sentinel') : true;

  if (getOPDWorksOnDom) {
    var object_get_own_property_descriptor_x_esm_res = attempt_x_esm(nativeGOPD, to_object_x_esm('abc'), 1);
    var worksWithStr = object_get_own_property_descriptor_x_esm_res.threw === false && object_get_own_property_descriptor_x_esm_res.value && object_get_own_property_descriptor_x_esm_res.value.value === 'b';

    if (worksWithStr) {
      var getOPDWorksOnObject = object_get_own_property_descriptor_x_esm_doesGOPDWork({}, 'sentinel');

      if (getOPDWorksOnObject) {
        var worksWithPrim = attempt_x_esm(nativeGOPD, 42, 'name').threw === false;
        /* eslint-disable-next-line compat/compat */

        var worksWithObjSym = has_symbol_support_x_esm && object_get_own_property_descriptor_x_esm_doesGOPDWork({}, to_object_x_esm(Symbol(object_get_own_property_descriptor_x_esm_EMPTY_STRING)));

        if (worksWithObjSym) {
          if (worksWithPrim) {
            $getOwnPropertyDescriptor = nativeGOPD;
          } else {
            $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
              return nativeGOPD(to_object_x_esm(object), property);
            };
          }
        } else if (worksWithPrim) {
          $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
            return nativeGOPD(object, to_property_key_x_esm(property));
          };
        } else {
          $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
            return nativeGOPD(to_object_x_esm(object), to_property_key_x_esm(property));
          };
        }
      } else {
        getOPDFallback1 = nativeGOPD;
      }
    } else {
      getOPDFallback2 = nativeGOPD;
    }
  }
}

if (to_boolean_x_esm($getOwnPropertyDescriptor) === false || getOPDFallback1 || getOPDFallback2) {
  $getOwnPropertyDescriptor = object_get_own_property_descriptor_x_esm_implementation;
}

var gOPS = $getOwnPropertyDescriptor;
/* harmony default export */ var object_get_own_property_descriptor_x_esm = (gOPS);


// CONCATENATED MODULE: ./node_modules/util-get-getter-x/dist/util-get-getter-x.esm.js





var stubTrue = function stubTrue() {
  return true;
};
/**
 * @param {Function|!object} creator - A creator function or a created object.
 * @returns {!object} - An attempt object.
 */


var util_get_getter_x_esm_getResult = function getResult(creator) {
  return typeof creator === 'function' ? attempt_x_esm(creator) : {
    threw: false,
    value: creator
  };
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * @param {!object} descriptor - A descriptor object.
 * @param {!object} context - A created object.
 * @param {Function} [validator] - A function to validate the result.
 * @returns {Function|null} - The getter function or null.
 */
// eslint-enable jsdoc/check-param-names


var util_get_getter_x_esm_getter = function getter(descriptor, context) {
  /* eslint-disable-next-line prefer-rest-params */
  var validator = typeof arguments[2] === 'function' ? arguments[2] : stubTrue;
  var res = attempt_x_esm(function attemptee() {
    return simple_call_x_esm(descriptor.get, context);
  });
  return res.threw === false && validator(res.value) ? descriptor.get : null;
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * Get a getter.
 *
 * @param {Function|!object} creator - A creator function or a created object.
 * @param {string} getterName - The getter name.
 * @param {Function} [validator] - A function to validate the result.
 * @returns {Function|null} The target.
 */
// eslint-enable jsdoc/check-param-names


var util_get_getter_x_esm_getGetter = function getGetter(creator, getterName) {
  var resTest1 = util_get_getter_x_esm_getResult(creator);

  if (resTest1.threw === false && is_object_like_x_esm(resTest1.value)) {
    var descriptor = object_get_own_property_descriptor_x_esm(resTest1.value.constructor.prototype, getterName);

    if (descriptor && typeof descriptor.get === 'function') {
      /* eslint-disable-next-line prefer-rest-params */
      return util_get_getter_x_esm_getter(descriptor, resTest1.value, arguments[2]);
    }
  }

  return null;
};

/* harmony default export */ var util_get_getter_x_esm = (util_get_getter_x_esm_getGetter);


// CONCATENATED MODULE: ./node_modules/is-map-x/dist/is-map-x.esm.js






var is_map_x_esm_creator = function creator() {
  /* eslint-disable-next-line compat/compat */
  return new Map();
};

var getSize = util_get_getter_x_esm(is_map_x_esm_creator, 'size', is_length_x_esm);
/**
 * Determine if an `object` is a `Map`.
 *
 * @param {*} object - The object to test.
 * @returns {boolean} `true` if the `object` is a `Map`,
 *  else `false`.
 */

var is_map_x_esm_isMap = function isMap(object) {
  if (getSize === null || is_object_like_x_esm(object) === false) {
    return false;
  }

  var result = attempt_x_esm(function attemptee() {
    return simple_call_x_esm(getSize, object);
  });
  return result.threw === false && is_length_x_esm(result.value);
};

/* harmony default export */ var is_map_x_esm = (is_map_x_esm_isMap);


// CONCATENATED MODULE: ./node_modules/is-set-x/dist/is-set-x.esm.js






var is_set_x_esm_creator = function creator() {
  /* eslint-disable-next-line compat/compat */
  return new Set();
};

var is_set_x_esm_getSize = util_get_getter_x_esm(is_set_x_esm_creator, 'size', is_length_x_esm);
/**
 * Determine if an `object` is a `Set`.
 *
 * @param {*} object - The object to test.
 * @returns {boolean} `true` if the `object` is a `Set`,
 *  else `false`.
 */

var is_set_x_esm_isSet = function isSet(object) {
  if (is_set_x_esm_getSize === null || is_object_like_x_esm(object) === false) {
    return false;
  }

  var result = attempt_x_esm(function attemptee() {
    return simple_call_x_esm(is_set_x_esm_getSize, object);
  });
  return result.threw === false && is_length_x_esm(result.value);
};

/* harmony default export */ var is_set_x_esm = (is_set_x_esm_isSet);


// CONCATENATED MODULE: ./node_modules/assert-is-object-x/dist/assert-is-object-x.esm.js


/**
 * Tests `value` to see if it is an object, throws a `TypeError` if it is
 * not. Otherwise returns the `value`.
 *
 * @param {*} value - The argument to be tested.
 * @param {string} [message] - An alternative user message.
 * @throws {TypeError} Throws if `value` is not an object.
 * @returns {*} Returns `value` if it is an object.
 */

var assert_is_object_x_esm_assertIsObject = function assertIsObject(value, message) {
  if (is_primitive_x_esm(value)) {
    var msg = arguments.length > 1 ? to_string_symbols_supported_x_esm(message) : "".concat(to_string_symbols_supported_x_esm(value), " is not an object");
    throw new TypeError(msg);
  }

  return value;
};

/* harmony default export */ var assert_is_object_x_esm = (assert_is_object_x_esm_assertIsObject);


// CONCATENATED MODULE: ./node_modules/object-define-property-x/dist/object-define-property-x.esm.js








var object_define_property_x_esm_ObjectCtr = {}.constructor;
var nd = object_define_property_x_esm_ObjectCtr.defineProperty;
var nativeDefProp = typeof nd === 'function' && nd;
var definePropertyFallback;

var object_define_property_x_esm_toPropertyDescriptor = function toPropertyDescriptor(desc) {
  var object = to_object_x_esm(desc);
  var descriptor = {};

  if (has_own_property_x_esm(object, 'enumerable')) {
    descriptor.enumerable = to_boolean_x_esm(object.enumerable);
  }

  if (has_own_property_x_esm(object, 'configurable')) {
    descriptor.configurable = to_boolean_x_esm(object.configurable);
  }

  if (has_own_property_x_esm(object, 'value')) {
    descriptor.value = object.value;
  }

  if (has_own_property_x_esm(object, 'writable')) {
    descriptor.writable = to_boolean_x_esm(object.writable);
  }

  if (has_own_property_x_esm(object, 'get')) {
    var getter = object.get;

    if (typeof getter !== 'undefined' && is_function_x_esm(getter) === false) {
      throw new TypeError('getter must be a function');
    }

    descriptor.get = getter;
  }

  if (has_own_property_x_esm(object, 'set')) {
    var setter = object.set;

    if (typeof setter !== 'undefined' && is_function_x_esm(setter) === false) {
      throw new TypeError('setter must be a function');
    }

    descriptor.set = setter;
  }

  if ((has_own_property_x_esm(descriptor, 'get') || has_own_property_x_esm(descriptor, 'set')) && (has_own_property_x_esm(descriptor, 'value') || has_own_property_x_esm(descriptor, 'writable'))) {
    throw new TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
  }

  return descriptor;
}; // ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6
// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/es-shims/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423


var object_define_property_x_esm_prototypeOfObject = object_define_property_x_esm_ObjectCtr.prototype; // If JS engine supports accessors creating shortcuts.

var object_define_property_x_esm_supportsAccessors = has_own_property_x_esm(object_define_property_x_esm_prototypeOfObject, '__defineGetter__');
/* eslint-disable-next-line no-underscore-dangle,no-restricted-properties */

var defineGetter = object_define_property_x_esm_supportsAccessors && simple_methodize_x_esm(object_define_property_x_esm_prototypeOfObject.__defineGetter__);
/* eslint-disable-next-line no-underscore-dangle,no-restricted-properties */

var defineSetter = object_define_property_x_esm_supportsAccessors && simple_methodize_x_esm(object_define_property_x_esm_prototypeOfObject.__defineSetter__);
/* eslint-disable-next-line no-underscore-dangle */

var object_define_property_x_esm_lookupGetter = object_define_property_x_esm_supportsAccessors && simple_methodize_x_esm(object_define_property_x_esm_prototypeOfObject.__lookupGetter__);
/* eslint-disable-next-line no-underscore-dangle */

var object_define_property_x_esm_lookupSetter = object_define_property_x_esm_supportsAccessors && simple_methodize_x_esm(object_define_property_x_esm_prototypeOfObject.__lookupSetter__);
var object_define_property_x_esm_implementation = function defineProperty(object, property, descriptor) {
  assert_is_object_x_esm(object);
  var propKey = to_property_key_x_esm(property);
  var propDesc = object_define_property_x_esm_toPropertyDescriptor(descriptor); // make a valiant attempt to use the real defineProperty for IE8's DOM elements.

  if (definePropertyFallback) {
    var result = attempt_x_esm(function attemptee() {
      return definePropertyFallback(object_define_property_x_esm_ObjectCtr, object, propKey, propDesc);
    });

    if (result.threw === false) {
      return result.value;
    } // try the shim if the real one doesn't work

  } // If it's a data property.


  if (has_own_property_x_esm(propDesc, 'value')) {
    // fail silently if 'writable', 'enumerable', or 'configurable' are requested but not supported
    if (object_define_property_x_esm_supportsAccessors && (object_define_property_x_esm_lookupGetter(object, propKey) || object_define_property_x_esm_lookupSetter(object, propKey))) {
      // As accessors are supported only on engines implementing
      // `__proto__` we can safely override `__proto__` while defining
      // a property to make sure that we don't hit an inherited accessor.

      /* eslint-disable-next-line no-proto */
      var prototype = object.__proto__;
      /* eslint-disable-next-line no-proto */

      object.__proto__ = object_define_property_x_esm_prototypeOfObject; // Deleting a property anyway since getter / setter may be defined on object itself.

      delete object[propKey];
      object[propKey] = propDesc.value; // Setting original `__proto__` back now.

      /* eslint-disable-next-line no-proto */

      object.__proto__ = prototype;
    } else {
      object[propKey] = propDesc.value;
    }
  } else {
    if (object_define_property_x_esm_supportsAccessors === false && (propDesc.get || propDesc.set)) {
      throw new TypeError('getters & setters can not be defined on this javascript engine');
    } // If we got that far then getters and setters can be defined !!


    if (propDesc.get) {
      defineGetter(object, propKey, propDesc.get);
    }

    if (propDesc.set) {
      defineSetter(object, propKey, propDesc.set);
    }
  }

  return object;
};
/**
 * This method defines a new property directly on an object, or modifies an
 * existing property on an object, and returns the object.
 *
 * @param {object} object - The object on which to define the property.
 * @param {string} property - The name of the property to be defined or modified.
 * @param {object} descriptor - The descriptor for the property being defined or modified.
 * @returns {object} The object that was passed to the function.
 * });.
 */

var $defineProperty; // check whether defineProperty works if it's given. Otherwise, shim partially.

if (nativeDefProp) {
  var object_define_property_x_esm_testWorksWith = function testWorksWith(object) {
    var testResult = attempt_x_esm(nativeDefProp, object, 'sentinel', {});
    return testResult.threw === false && testResult.value === object && 'sentinel' in object;
  };

  var object_define_property_x_esm_doc = typeof document !== 'undefined' && document;

  if (object_define_property_x_esm_testWorksWith({}) && (to_boolean_x_esm(object_define_property_x_esm_doc) === false || object_define_property_x_esm_testWorksWith(object_define_property_x_esm_doc.createElement('div')))) {
    $defineProperty = function defineProperty(object, property, descriptor) {
      return nativeDefProp(assert_is_object_x_esm(object), to_property_key_x_esm(property), object_define_property_x_esm_toPropertyDescriptor(descriptor));
    };
  } else {
    definePropertyFallback = nativeDefProp;
  }
}

if (to_boolean_x_esm(nativeDefProp) === false || definePropertyFallback) {
  $defineProperty = object_define_property_x_esm_implementation;
}

var defProp = $defineProperty;
/* harmony default export */ var object_define_property_x_esm = (defProp);


// CONCATENATED MODULE: ./node_modules/is-regexp-x/dist/is-regexp-x.esm.js







var regexExec = simple_methodize_x_esm(/none/.exec);
var regexClass = '[object RegExp]';

var tryRegexExecCall = function tryRegexExec(value, descriptor) {
  try {
    value.lastIndex = 0;
    regexExec(value);
    return true;
  } catch (e) {
    return false;
  } finally {
    object_define_property_x_esm(value, 'lastIndex', descriptor);
  }
};
/**
 * This method tests if a value is a regex.
 *
 * @param {*} value - The value to test.
 * @returns {boolean} `true` if value is a regex; otherwise `false`.
 */


var is_regexp_x_esm_isRegex = function isRegex(value) {
  if (is_object_like_x_esm(value) === false) {
    return false;
  }

  if (has_to_string_tag_x_esm === false) {
    return to_string_tag_x_esm(value) === regexClass;
  }

  var descriptor = object_get_own_property_descriptor_x_esm(value, 'lastIndex');
  var hasLastIndexDataProperty = descriptor && has_own_property_x_esm(descriptor, 'value');

  if (hasLastIndexDataProperty !== true) {
    return false;
  }

  return tryRegexExecCall(value, descriptor);
};

/* harmony default export */ var is_regexp_x_esm = (is_regexp_x_esm_isRegex);


// CONCATENATED MODULE: ./node_modules/to-length-x/dist/to-length-x.esm.js

var to_length_x_esm_MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Converts `value` to an integer suitable for use as the length of an
 * array-like object. (ES2019).
 *
 * @param {*} value - The value to convert.
 * @returns {number} Returns the converted integer.
 */

var to_length_x_esm_toLength = function toLength(value) {
  var len = to_integer_x_esm(value); // includes converting -0 to +0

  if (len <= 0) {
    return 0;
  }

  if (len > to_length_x_esm_MAX_SAFE_INTEGER) {
    return to_length_x_esm_MAX_SAFE_INTEGER;
  }

  return len;
};

/* harmony default export */ var to_length_x_esm = (to_length_x_esm_toLength);


// CONCATENATED MODULE: ./node_modules/same-value-x/dist/same-value-x.esm.js

/**
 * This method is the comparison abstract operation SameValue(x, y), where x
 * and y are ECMAScript language values, produces true or false.
 *
 * @param {*} [value1] - The first value to compare.
 * @param {*} [value2] - The second value to compare.
 * @returns {boolean} A Boolean indicating whether or not the two arguments are
 *  the same value.
 */

var same_value_x_esm_sameValue = function sameValue(value1, value2) {
  if (value1 === 0 && value2 === 0) {
    return 1 / value1 === 1 / value2;
  }

  if (value1 === value2) {
    return true;
  }

  return is_nan_x_esm(value1) && is_nan_x_esm(value2);
};

/* harmony default export */ var same_value_x_esm = (same_value_x_esm_sameValue);


// CONCATENATED MODULE: ./node_modules/same-value-zero-x/dist/same-value-zero-x.esm.js

/**
 * This method determines whether two values are the same value.
 * SameValueZero differs from SameValue (`Object.is`) only in its treatment
 * of +0 and -0.
 *
 * @param {*} [x] - The first value to compare.
 * @param {*} [y] - The second value to compare.
 * @returns {boolean} A Boolean indicating whether or not the two arguments
 * are the same value.
 */

var same_value_zero_x_esm_sameValueZero = function sameValueZero(x, y) {
  return x === y || same_value_x_esm(x, y);
};

/* harmony default export */ var same_value_zero_x_esm = (same_value_zero_x_esm_sameValueZero);


// CONCATENATED MODULE: ./node_modules/assert-is-function-x/dist/assert-is-function-x.esm.js



/**
 * Tests `callback` to see if it is a function, throws a `TypeError` if it is
 * not. Otherwise returns the `callback`.
 *
 * @param {*} callback - The argument to be tested.
 * @param {string} [message] - An alternative user message.
 * @throws {TypeError} Throws if `callback` is not a function.
 * @returns {*} Returns `callback` if it is function.
 */

var assert_is_function_x_esm_assertIsFunction = function assertIsFunction(callback, message) {
  if (is_function_x_esm(callback) === false) {
    var msg = arguments.length > 1 ? to_string_symbols_supported_x_esm(message) : "".concat(is_primitive_x_esm(callback) ? to_string_symbols_supported_x_esm(callback) : '#<Object>', " is not a function");
    throw new TypeError(msg);
  }

  return callback;
};

/* harmony default export */ var assert_is_function_x_esm = (assert_is_function_x_esm_assertIsFunction);


// CONCATENATED MODULE: ./node_modules/split-if-boxed-bug-x/dist/split-if-boxed-bug-x.esm.js



var split_if_boxed_bug_x_esm_EMPTY_STRING = '';
var strSplit = simple_methodize_x_esm(split_if_boxed_bug_x_esm_EMPTY_STRING.split);

var identity = function splitIfBoxedBug(value) {
  return value;
};

var split_if_boxed_bug_x_esm_implementation = function splitIfBoxedBug(value) {
  return is_string_default()(value) ? strSplit(value, split_if_boxed_bug_x_esm_EMPTY_STRING) : identity(value);
};
/**
 * This method tests if a value is a string with the boxed bug; splits to an
 * array for iteration; otherwise returns the original value.
 *
 * @param {*} [value] - The value to be tested.
 * @returns {*} An array or characters if value was a string with the boxed bug;
 *  otherwise the value.
 */

var $splitIfBoxedBug = has_boxed_string_x_esm ? identity : split_if_boxed_bug_x_esm_implementation;
/* harmony default export */ var split_if_boxed_bug_x_esm = ($splitIfBoxedBug);


// CONCATENATED MODULE: ./node_modules/find-index-x/dist/find-index-x.esm.js
var find_index_x_esm_this = undefined;

function find_index_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }






var pFindIndex = typeof Array.prototype.findIndex === 'function' && Array.prototype.findIndex;
var find_index_x_esm_isWorking;

if (pFindIndex) {
  var find_index_x_esm_testArr = [];
  find_index_x_esm_testArr.length = 2;
  find_index_x_esm_testArr[1] = 1;
  var find_index_x_esm_res = attempt_x_esm.call(find_index_x_esm_testArr, pFindIndex, function (item, idx) {
    find_index_x_esm_newArrowCheck(this, find_index_x_esm_this);

    return idx === 0;
  }.bind(undefined));
  find_index_x_esm_isWorking = find_index_x_esm_res.threw === false && find_index_x_esm_res.value === 0;

  if (find_index_x_esm_isWorking) {
    find_index_x_esm_res = attempt_x_esm.call(1, pFindIndex, function (item, idx) {
      find_index_x_esm_newArrowCheck(this, find_index_x_esm_this);

      return idx === 0;
    }.bind(undefined));
    find_index_x_esm_isWorking = find_index_x_esm_res.threw === false && find_index_x_esm_res.value === -1;
  }

  if (find_index_x_esm_isWorking) {
    find_index_x_esm_isWorking = attempt_x_esm.call([], pFindIndex).threw;
  }

  if (find_index_x_esm_isWorking) {
    find_index_x_esm_res = attempt_x_esm.call('abc', pFindIndex, function (item) {
      find_index_x_esm_newArrowCheck(this, find_index_x_esm_this);

      return item === 'c';
    }.bind(undefined));
    find_index_x_esm_isWorking = find_index_x_esm_res.threw === false && find_index_x_esm_res.value === 2;
  }

  if (find_index_x_esm_isWorking) {
    find_index_x_esm_res = attempt_x_esm.call(function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }('a', 'b', 'c'), pFindIndex, function (item) {
      find_index_x_esm_newArrowCheck(this, find_index_x_esm_this);

      return item === 'c';
    }.bind(undefined));
    find_index_x_esm_isWorking = find_index_x_esm_res.threw === false && find_index_x_esm_res.value === 2;
  }
}
/**
 * Like `findIndex`, this method returns an index in the array, if an element
 * in the array satisfies the provided testing function. Otherwise -1 is returned.
 *
 * @param {Array} array - The array to search.
 * @throws {TypeError} If array is `null` or `undefined`-.
 * @param {Function} callback - Function to execute on each value in the array,
 *  taking three arguments: `element`, `index` and `array`.
 * @throws {TypeError} If `callback` is not a function.
 * @param {*} [thisArg] - Object to use as `this` when executing `callback`.
 * @returns {number} Returns index of positively tested element, otherwise -1.
 */


var findIdx;

if (find_index_x_esm_isWorking) {
  findIdx = function findIndex(array, callback) {
    var args = [callback];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return pFindIndex.apply(array, args);
  };
} else {
  findIdx = function findIndex(array, callback) {
    var object = to_object_x_esm(array);
    assert_is_function_x_esm(callback);
    var iterable = split_if_boxed_bug_x_esm(object);
    var length = to_length_x_esm(iterable.length);

    if (length < 1) {
      return -1;
    }

    var thisArg;

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      thisArg = arguments[2];
    }

    var index = 0;

    while (index < length) {
      if (callback.call(thisArg, iterable[index], index, object)) {
        return index;
      }

      index += 1;
    }

    return -1;
  };
}

var fi = findIdx;
/* harmony default export */ var find_index_x_esm = (fi);


// CONCATENATED MODULE: ./node_modules/is-array-like-x/dist/is-array-like-x.esm.js



/**
 * Checks if value is array-like. A value is considered array-like if it's
 * not a function and has a `length` that's an integer greater than or
 * equal to 0 and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @param {*} value - The object to be tested.
 */

var is_array_like_x_esm_isArrayLike = function isArrayLike(value) {
  return is_nil_x_esm(value) === false && is_function_x_esm(value, true) === false && is_length_x_esm(value.length);
};

/* harmony default export */ var is_array_like_x_esm = (is_array_like_x_esm_isArrayLike);


// CONCATENATED MODULE: ./node_modules/calculate-from-index-x/dist/calculate-from-index-x.esm.js





var calculate_from_index_x_esm_getMax = function getMax(a, b) {
  return a >= b ? a : b;
};
/**
 * This method calculates a fromIndex of a given value for an array.
 *
 * @param {Array} array - * The array on which to calculate the starting index.
 * @throws {TypeError} If array is null or undefined.
 * @param {number} fromIndex - * The position in this array at which to begin. A
 *  negative value gives the index of array.length + fromIndex by asc.
 * @returns {number} The calculated fromIndex. Default is 0.
 */


var calculate_from_index_x_esm_calcFromIndex = function calcFromIndex(array, fromIndex) {
  var object = to_object_x_esm(array);

  if (is_array_like_x_esm(object) === false) {
    return 0;
  }

  var index = to_integer_x_esm(fromIndex);
  return index >= 0 ? index : calculate_from_index_x_esm_getMax(0, to_length_x_esm(object.length) + index);
};

/* harmony default export */ var calculate_from_index_x_esm = (calculate_from_index_x_esm_calcFromIndex);


// CONCATENATED MODULE: ./node_modules/index-of-x/dist/index-of-x.esm.js
function index_of_x_esm_newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }














var nio = [].indexOf;
var nativeIndexOf = typeof nio === 'function' && simple_methodize_x_esm(nio);
var mathMax = Math.max;

var index_of_x_esm_test1 = function test1() {
  var res = attempt_x_esm(nativeIndexOf, [0, 1], 1, 2);
  return res.threw === false && res.value === -1;
};

var index_of_x_esm_test2 = function test2() {
  var res = attempt_x_esm(nativeIndexOf, [0, 1], 1);
  return res.threw === false && res.value === 1;
};

var index_of_x_esm_test3 = function test3() {
  var res = attempt_x_esm(nativeIndexOf, [0, -0], -0);
  return res.threw === false && res.value === 0;
};

var index_of_x_esm_test4 = function test4() {
  var testArr = [];
  testArr.length = 2;
  /* eslint-disable-next-line no-void */

  testArr[1] = void 0;
  /* eslint-disable-next-line no-void */

  var res = attempt_x_esm(nativeIndexOf, testArr, void 0);
  return res.threw === false && res.value === 1;
};

var index_of_x_esm_test5 = function test5() {
  var res = attempt_x_esm(nativeIndexOf, 'abc', 'c');
  return res.threw === false && res.value === 2;
};

var index_of_x_esm_test6 = function test6() {
  var args = function getArgs() {
    /* eslint-disable-next-line prefer-rest-params */
    return arguments;
  }('a', 'b', 'c');

  var res = attempt_x_esm(nativeIndexOf, args, 'c');
  return res.threw === false && res.value === 2;
};

var index_of_x_esm_isWorking = to_boolean_x_esm(nativeIndexOf) && index_of_x_esm_test1() && index_of_x_esm_test2() && index_of_x_esm_test3() && index_of_x_esm_test4() && index_of_x_esm_test5() && index_of_x_esm_test6();
var index_of_x_esm_implementation = function indexOf(array, searchElement) {
  var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

  var iterable = split_if_boxed_bug_x_esm(object);
  var length = to_length_x_esm(iterable.length);

  if (length === 0) {
    return -1;
  }

  var i = 0;

  if (arguments.length > 2) {
    /* eslint-disable-next-line prefer-rest-params */
    i = to_integer_x_esm(arguments[2]);
  } // handle negative indices


  i = i >= 0 ? i : mathMax(0, length + i);

  for (; i < length; i += 1) {
    if (i in iterable && iterable[i] === searchElement) {
      return i;
    }
  }

  return -1;
};
var pIndexOf = index_of_x_esm_isWorking ? nativeIndexOf : index_of_x_esm_implementation;
/**
 * This method returns an index in the array, if an element in the array
 * satisfies the provided testing function. Otherwise -1 is returned.
 *
 * @private
 * @param {Array} array - The array to search.
 * @param {*} searchElement - Element to locate in the array.
 * @param {number} fromIndex - The index to start the search at.
 * @param {Function} extendFn - The comparison function to use.
 * @returns {number} Returns index of found element, otherwise -1.
 */

var findIdxFrom = function findIndexFrom(array, searchElement, fromIndex, extendFn) {
  var fIdx = fromIndex;
  var length = to_length_x_esm(array.length);

  while (fIdx < length) {
    if (fIdx in array && extendFn(array[fIdx], searchElement)) {
      return fIdx;
    }

    fIdx += 1;
  }

  return -1;
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method returns the first index at which a given element can be found
 * in the array, or -1 if it is not present.
 *
 * @param {Array} array - The array to search.
 * @throws {TypeError} If `array` is `null` or `undefined`.
 * @param {*} searchElement - Element to locate in the `array`.
 * @param {number} [fromIndex] - The index to start the search at. If the
 *  index is greater than or equal to the array's length, -1 is returned,
 *  which means the array will not be searched. If the provided index value is
 *  a negative number, it is taken as the offset from the end of the array.
 *  Note: if the provided index is negative, the array is still searched from
 *  front to back. If the calculated index is less than 0, then the whole
 *  array will be searched. Default: 0 (entire array is searched).
 * @param {string} [extend] - Extension type: `SameValue` or `SameValueZero`.
 * @returns {number} Returns index of found element, otherwise -1.
 */
// eslint-enable jsdoc/check-param-names


var index_of_x_esm_indexOf = function indexOf(array, searchElement) {
  var _this = this;

  var object = to_object_x_esm(array);
  var iterable = split_if_boxed_bug_x_esm(object);
  var length = to_length_x_esm(iterable.length);

  if (length < 1) {
    return -1;
  }

  var argLength = arguments.length;
  /* eslint-disable-next-line prefer-rest-params */

  var extend = argLength > 2 && argLength > 3 ? arguments[3] : arguments[2];
  var extendFn;

  if (is_string_default()(extend)) {
    extend = extend.toLowerCase();

    if (extend === 'samevalue') {
      extendFn = same_value_x_esm;
    } else if (extend === 'samevaluezero') {
      extendFn = same_value_zero_x_esm;
    }
  }

  var fromIndex = 0;

  if (extendFn && (searchElement === 0 || is_nan_x_esm(searchElement))) {
    if (argLength > 3) {
      /* eslint-disable-next-line prefer-rest-params */
      fromIndex = calculate_from_index_x_esm(iterable, arguments[2]);

      if (fromIndex >= length) {
        return -1;
      }

      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }

    if (fromIndex > 0) {
      return findIdxFrom(iterable, searchElement, fromIndex, extendFn);
    }

    return find_index_x_esm(iterable, function (element, index) {
      index_of_x_esm_newArrowCheck(this, _this);

      return index in iterable && extendFn(searchElement, element);
    }.bind(this));
  }

  if (argLength > 3 || argLength > 2 && to_boolean_x_esm(extendFn) === false) {
    /* eslint-disable-next-line prefer-rest-params */
    fromIndex = calculate_from_index_x_esm(iterable, arguments[2]);

    if (fromIndex >= length) {
      return -1;
    }

    if (fromIndex < 0) {
      fromIndex = 0;
    }
  }

  return pIndexOf(iterable, searchElement, fromIndex);
};

/* harmony default export */ var index_of_x_esm = (index_of_x_esm_indexOf);


// CONCATENATED MODULE: ./node_modules/is-array-x/dist/is-array-x.esm.js


var nia = [].isArray;
var nativeIsArray = typeof nia === 'function' && nia;
var is_array_x_esm_testResult = attempt_x_esm(function attemptee() {
  return nativeIsArray([]) === true && nativeIsArray({
    length: 0
  }) === false;
});
var is_array_x_esm_isWorking = is_array_x_esm_testResult.threw === false && is_array_x_esm_testResult.value === true;
var is_array_x_esm_implementation = function isArray(value) {
  return to_string_tag_x_esm(value) === '[object Array]';
};
/**
 * Determines whether the passed value is an Array.
 *
 * @param {*} value - The value to test.
 * @returns {boolean} - True if an array; otherwise false.
 */

var is_array_x_esm_isArray = is_array_x_esm_isWorking ? nativeIsArray : is_array_x_esm_implementation;
/* harmony default export */ var is_array_x_esm = (is_array_x_esm_isArray);


// CONCATENATED MODULE: ./node_modules/array-like-slice-x/dist/array-like-slice-x.esm.js





var array_like_slice_x_esm_getMax = function getMax(a, b) {
  return a >= b ? a : b;
};

var getMin = function getMin(a, b) {
  return a <= b ? a : b;
};

var setRelative = function setRelative(value, length) {
  return value < 0 ? array_like_slice_x_esm_getMax(length + value, 0) : getMin(value, length);
};
/**
 * The slice() method returns a shallow copy of a portion of an array into a new
 * array object selected from begin to end (end not included). The original
 * array will not be modified.
 *
 * @param {!object} arrayLike - The array like object to slice.
 * @param {number} [start] - Zero-based index at which to begin extraction.
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. Running slice(-2) extracts the last two elements in the sequence.
 *  If begin is undefined, slice begins from index 0.
 * @param {number} [end] - Zero-based index before which to end extraction.
 *  Slice extracts up to but not including end. For example, slice([0,1,2,3,4],1,4)
 *  extracts the second element through the fourth element (elements indexed
 *  1, 2, and 3).
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. Running slice(2,-1) extracts the third element through the second-to-last
 *  element in the sequence.
 *  If end is omitted, slice extracts through the end of the sequence (arr.length).
 *  If end is greater than the length of the sequence, slice extracts through
 *  the end of the sequence (arr.length).
 * @returns {Array} A new array containing the extracted elements.
 */


var array_like_slice_x_esm_slice = function slice(arrayLike, start, end) {
  var iterable = split_if_boxed_bug_x_esm(to_object_x_esm(arrayLike));
  var length = to_length_x_esm(iterable.length);
  var k = setRelative(to_integer_x_esm(start), length);
  var relativeEnd = typeof end === 'undefined' ? length : to_integer_x_esm(end);
  var finalEnd = setRelative(relativeEnd, length);
  var val = [];
  val.length = array_like_slice_x_esm_getMax(finalEnd - k, 0);
  var next = 0;

  while (k < finalEnd) {
    if (k in iterable) {
      val[next] = iterable[k];
    }

    next += 1;
    k += 1;
  }

  return val;
};

/* harmony default export */ var array_like_slice_x_esm = (array_like_slice_x_esm_slice);


// CONCATENATED MODULE: ./node_modules/array-slice-x/dist/array-slice-x.esm.js







var methodizedSlice = simple_methodize_x_esm([].slice);

var array_slice_x_esm_testArray = function testArray() {
  var res = attempt_x_esm(function attemptee() {
    return methodizedSlice([1, 2, 3], 1, 2);
  });
  return res.threw || is_array_x_esm(res.value) === false || res.value.length !== 1 || res.value[0] !== 2;
};

var array_slice_x_esm_testString = function testString() {
  var res = attempt_x_esm(function attemptee() {
    return methodizedSlice('abc', 1, 2);
  });
  return res.threw || is_array_x_esm(res.value) === false || res.value.length !== 1 || res.value[0] !== 'b';
};

var array_slice_x_esm_testDOM = function testDOM() {
  var doc = typeof document !== 'undefined' && document;
  var resultDocElement = doc ? attempt_x_esm(function attemptee() {
    return methodizedSlice(doc.documentElement);
  }).threw : false;
  return resultDocElement ? resultDocElement.threw : false;
};

var failArray = array_slice_x_esm_testArray();
var failString = array_slice_x_esm_testString();
var failDOM = array_slice_x_esm_testDOM();

var array_slice_x_esm_useArrayLike = function useArrayLike(object) {
  return failArray || failDOM && is_array_x_esm(object) === false || failString && is_string_default()(object) || is_arguments_default()(object);
};
/**
 * The slice() method returns a shallow copy of a portion of an array into a new
 * array object selected from begin to end (end not included). The original
 * array will not be modified.
 *
 * @param {Array|object} array - The array to slice.
 * @param {number} [start] - Zero-based index at which to begin extraction.
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. Running slice(-2) extracts the last two elements in the sequence.
 *  If begin is undefined, slice begins from index 0.
 * @param {number} [end] - Zero-based index before which to end extraction.
 *  Slice extracts up to but not including end. For example, slice(1,4)
 *  extracts the second element through the fourth element (elements indexed
 *  1, 2, and 3).
 *  A negative index can be used, indicating an offset from the end of the
 *  sequence. Running slice(2,-1) extracts the third element through the second-to-last
 *  element in the sequence.
 *  If end is omitted, slice extracts through the end of the
 *  sequence (arr.length).
 *  If end is greater than the length of the sequence, slice extracts through
 *  the end of the sequence (arr.length).
 * @returns {Array} A new array containing the extracted elements.
 */


var array_slice_x_esm_slice = function slice(array, start, end) {
  var object = to_object_x_esm(array);
  return array_slice_x_esm_useArrayLike(object) ? array_like_slice_x_esm(object, start, end) : methodizedSlice(object, start, end);
};

/* harmony default export */ var array_slice_x_esm = (array_slice_x_esm_slice);


// CONCATENATED MODULE: ./node_modules/array-any-x/dist/array-any-x.esm.js




 // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method tests whether some element in the array passes the test
 * implemented by the provided function.
 *
 * @function any
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to test for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {boolean} `true` if the callback function returns a truthy value for
 *  any array element; otherwise, `false`.
 */
// eslint-enable jsdoc/check-param-names

var array_any_x_esm_any = function any(array, callBack
/* , thisArg */
) {
  var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

  assert_is_function_x_esm(callBack);
  var iterable = split_if_boxed_bug_x_esm(object);
  var length = to_length_x_esm(iterable.length);

  if (length) {
    /* eslint-disable-next-line prefer-rest-params */
    var thisArg = arguments[2];

    for (var index = 0; index < length; index += 1) {
      if (simple_call_x_esm(callBack, thisArg, [iterable[index], index, object])) {
        return true;
      }
    }
  }

  return false;
};

/* harmony default export */ var array_any_x_esm = (array_any_x_esm_any);


// CONCATENATED MODULE: ./node_modules/array-some-x/dist/array-some-x.esm.js








var ns = [].some;
var nativeSome = typeof ns === 'function' && simple_methodize_x_esm(ns);

var array_some_x_esm_test1 = function test1() {
  var spy = 0;
  var res = attempt_x_esm(function attemptee() {
    return nativeSome([1, 2], function spyAdd1(item) {
      spy += item;
      return false;
    });
  });
  return res.threw === false && res.value === false && spy === 3;
};

var array_some_x_esm_test2 = function test2() {
  var spy = '';
  var res = attempt_x_esm(function attemptee() {
    return nativeSome(to_object_x_esm('abc'), function spyAdd2(item, index) {
      spy += item;
      return index === 1;
    });
  });
  return res.threw === false && res.value === true && spy === 'ab';
};

var array_some_x_esm_test3 = function test3() {
  var spy = 0;
  var res = attempt_x_esm(function attemptee() {
    var args = function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2, 3);

    return nativeSome(args, function spyAdd3(item, index) {
      spy += item;
      return index === 2;
    });
  });
  return res.threw === false && res.value === true && spy === 6;
};

var array_some_x_esm_test4 = function test4() {
  var spy = 0;
  var res = attempt_x_esm(function attemptee() {
    return nativeSome({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, function spyAdd4(item) {
      spy += item;
      return false;
    });
  });
  return res.threw === false && res.value === false && spy === 6;
};

var array_some_x_esm_doc = typeof document !== 'undefined' && document;

var array_some_x_esm_test5 = function test5() {
  if (array_some_x_esm_doc) {
    var spy = null;
    var fragment = array_some_x_esm_doc.createDocumentFragment();
    var div = array_some_x_esm_doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt_x_esm(function attemptee() {
      return nativeSome(fragment.childNodes, function spyAssign(item) {
        spy = item;
        return item;
      });
    });
    return res.threw === false && res.value === true && spy === div;
  }

  return true;
};

var isStrict = function getIsStrict() {
  /* eslint-disable-next-line babel/no-invalid-this */
  return to_boolean_x_esm(this) === false;
}();

var array_some_x_esm_test6 = function test6() {
  if (isStrict) {
    var spy = null;

    var thisTest = function thisTest() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    };

    var res = attempt_x_esm(function attemptee() {
      return nativeSome([1], thisTest, 'x');
    });
    return res.threw === false && res.value === false && spy === true;
  }

  return true;
};

var array_some_x_esm_test7 = function test7() {
  var spy = {};
  var fn = 'return nativeSome("foo", function (_, __, context) {' + 'if (castBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  var res = attempt_x_esm(function attemptee() {
    /* eslint-disable-next-line no-new-func */
    return Function('nativeSome', 'spy', 'castBoolean', fn)(nativeSome, spy, to_boolean_x_esm);
  });
  return res.threw === false && res.value === false && spy.value !== true;
};

var array_some_x_esm_isWorking = to_boolean_x_esm(nativeSome) && array_some_x_esm_test1() && array_some_x_esm_test2() && array_some_x_esm_test3() && array_some_x_esm_test4() && array_some_x_esm_test5() && array_some_x_esm_test6() && array_some_x_esm_test7();
console.log(array_some_x_esm_isWorking);

var patchedSome = function some(array, callBack
/* , thisArg */
) {
  /* eslint-disable-next-line prefer-rest-params */
  return nativeSome(require_object_coercible_x_esm(array), assert_is_function_x_esm(callBack), arguments[2]);
}; // ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some


var array_some_x_esm_implementation = function some(array, callBack
/* , thisArg */
) {
  var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

  assert_is_function_x_esm(callBack);

  var iteratee = function iteratee() {
    /* eslint-disable-next-line prefer-rest-params */
    var i = arguments[1];
    /* eslint-disable-next-line prefer-rest-params */

    if (i in arguments[2]) {
      /* eslint-disable-next-line prefer-rest-params,babel/no-invalid-this */
      if (simple_call_x_esm(callBack, this, [arguments[0], i, object])) {
        return true;
      }
    }

    return false;
  };
  /* eslint-disable-next-line prefer-rest-params */


  return array_any_x_esm(object, iteratee, arguments[2]);
};
/**
 * This method tests whether some element in the array passes the test
 * implemented by the provided function.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to test for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {boolean} `true` if the callback function returns a truthy value for
 *  any array element; otherwise, `false`.
 */

var $some = array_some_x_esm_isWorking ? patchedSome : array_some_x_esm_implementation;
/* harmony default export */ var array_some_x_esm = ($some);


// CONCATENATED MODULE: ./node_modules/array-all-x/dist/array-all-x.esm.js

 // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method executes a provided function once for each array element.
 *
 * @function all
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to execute for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 */
// eslint-enable jsdoc/check-param-names

var array_all_x_esm_all = function all(array, callBack
/* , thisArg */
) {
  array_any_x_esm(array, function iteratee() {
    /* eslint-disable-next-line prefer-rest-params,babel/no-invalid-this */
    simple_call_x_esm(callBack, this, arguments);
  },
  /* eslint-disable-next-line prefer-rest-params */
  arguments[2]);
};

/* harmony default export */ var array_all_x_esm = (array_all_x_esm_all);


// CONCATENATED MODULE: ./node_modules/array-filter-x/dist/array-filter-x.esm.js
function array_filter_x_esm_slicedToArray(arr, i) { return array_filter_x_esm_arrayWithHoles(arr) || array_filter_x_esm_iterableToArrayLimit(arr, i) || array_filter_x_esm_nonIterableRest(); }

function array_filter_x_esm_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function array_filter_x_esm_iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function array_filter_x_esm_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }









var nf = [].filter;
var nativeFilter = typeof nf === 'function' && simple_methodize_x_esm(nf);

var array_filter_x_esm_test1 = function test1() {
  var spy = 0;
  var res = attempt_x_esm(function attemptee() {
    return nativeFilter([1, 2], function spyAdd1(item) {
      spy += item;
      return false;
    });
  });
  return res.threw === false && res.value && res.value.length === 0 && spy === 3;
};

var array_filter_x_esm_test2 = function test2() {
  var spy = '';
  var res = attempt_x_esm(function attemptee() {
    return nativeFilter(to_object_x_esm('abc'), function spyAdd2(item, index) {
      spy += item;
      return index === 1;
    });
  });
  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === 'b' && spy === 'abc';
};

var array_filter_x_esm_test3 = function test3() {
  var spy = 0;
  var res = attempt_x_esm(function attemptee() {
    var args = function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2, 3);

    return nativeFilter(args, function spyAdd3(item, index) {
      spy += item;
      return index === 2;
    });
  });
  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === 3 && spy === 6;
};

var array_filter_x_esm_test4 = function test4() {
  var spy = 0;
  var res = attempt_x_esm(function attemptee() {
    return nativeFilter({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, function spyAdd4(item) {
      spy += item;
      return false;
    });
  });
  return res.threw === false && res.value && res.value.length === 0 && spy === 6;
};

var getTest5Result = function getTest5Result(args) {
  var _args = array_filter_x_esm_slicedToArray(args, 3),
      res = _args[0],
      div = _args[1],
      spy = _args[2];

  return res.threw === false && res.value && res.value.length === 1 && res.value[0] === div && spy === div;
};

var array_filter_x_esm_doc = typeof document !== 'undefined' && document;

var array_filter_x_esm_test5 = function test5() {
  if (array_filter_x_esm_doc) {
    var spy = null;
    var fragment = array_filter_x_esm_doc.createDocumentFragment();
    var div = array_filter_x_esm_doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt_x_esm(function attemptee() {
      return nativeFilter(fragment.childNodes, function spyAssign(item) {
        spy = item;
        return item;
      });
    });
    return getTest5Result([res, div, spy]);
  }

  return true;
};

var array_filter_x_esm_isStrict = function returnIsStrict() {
  /* eslint-disable-next-line babel/no-invalid-this */
  return to_boolean_x_esm(this) === false;
}();

var array_filter_x_esm_test6 = function test6() {
  if (array_filter_x_esm_isStrict) {
    var spy = null;

    var testThis = function testThis() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    };

    var res = attempt_x_esm(function attemptee() {
      return nativeFilter([1], testThis, 'x');
    });
    return res.threw === false && res.value && res.value.length === 0 && spy === true;
  }

  return true;
};

var array_filter_x_esm_test7 = function test7() {
  var spy = {};
  var fn = 'return nativeFilter("foo", function (_, __, context) {' + 'if (castBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  var res = attempt_x_esm(function attemptee() {
    /* eslint-disable-next-line no-new-func */
    return Function('nativeFilter', 'spy', 'castBoolean', fn)(nativeFilter, spy, to_boolean_x_esm);
  });
  return res.threw === false && res.value && res.value.length === 0 && spy.value !== true;
};

var array_filter_x_esm_isWorking = to_boolean_x_esm(nativeFilter) && array_filter_x_esm_test1() && array_filter_x_esm_test2() && array_filter_x_esm_test3() && array_filter_x_esm_test4() && array_filter_x_esm_test5() && array_filter_x_esm_test6() && array_filter_x_esm_test7();

var patchedFilter = function filter(array, callBack
/* , thisArg */
) {
  /* eslint-disable-next-line prefer-rest-params, */
  return nativeFilter(require_object_coercible_x_esm(array), assert_is_function_x_esm(callBack), arguments[2]);
};

var array_filter_x_esm_implementation = function filter(array, callBack
/* , thisArg */
) {
  var object = to_object_x_esm(array); // If no callback function or if callback is not a callable function

  assert_is_function_x_esm(callBack);
  var result = [];

  var predicate = function predicate() {
    /* eslint-disable-next-line prefer-rest-params */
    var i = arguments[1];
    /* eslint-disable-next-line prefer-rest-params */

    if (i in arguments[2]) {
      /* eslint-disable-next-line prefer-rest-params */
      var item = arguments[0];
      /* eslint-disable-next-line babel/no-invalid-this */

      if (simple_call_x_esm(callBack, this, [item, i, object])) {
        result[result.length] = item;
      }
    }
  };
  /* eslint-disable-next-line prefer-rest-params */


  array_all_x_esm(object, predicate, arguments[2]);
  return result;
};
/**
 * This method creates a new array with all elements that pass the test
 * implemented by the provided function.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function is a predicate, to test each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {Array} A new array with the elements that pass the test.
 */

var $filter = array_filter_x_esm_isWorking ? patchedFilter : array_filter_x_esm_implementation;
/* harmony default export */ var array_filter_x_esm = ($filter);


// EXTERNAL MODULE: ./node_modules/stable/stable.js
var stable = __webpack_require__(6);
var stable_default = /*#__PURE__*/__webpack_require__.n(stable);

// EXTERNAL MODULE: ./node_modules/object-keys/index.js
var object_keys = __webpack_require__(8);
var object_keys_default = /*#__PURE__*/__webpack_require__.n(object_keys);

// CONCATENATED MODULE: ./node_modules/object-keys-x/dist/object-keys-x.esm.js










var object_keys_x_esm_ObjectCtr = {}.constructor;
var nativeKeys = typeof object_keys_x_esm_ObjectCtr.keys === 'function' && object_keys_x_esm_ObjectCtr.keys;
var object_keys_x_esm_isWorking;
var throwsWithNull;
var object_keys_x_esm_worksWithPrim;
var worksWithRegex;
var worksWithArgs;
var object_keys_x_esm_worksWithStr;

if (nativeKeys) {
  var object_keys_x_esm_isCorrectRes = function isCorrectRes(r, length) {
    return r.threw === false && is_array_x_esm(r.value) && r.value.length === length;
  };

  var either = function either(r, a, b) {
    var x = r.value[0];
    var y = r.value[1];
    return x === a && y === b || x === b && y === a;
  };

  var testObj = {
    a: 1,
    b: 2
  };
  var object_keys_x_esm_res = attempt_x_esm(nativeKeys, testObj);
  object_keys_x_esm_isWorking = object_keys_x_esm_isCorrectRes(object_keys_x_esm_res, 2) && either(object_keys_x_esm_res, 'a', 'b');

  if (object_keys_x_esm_isWorking) {
    testObj = Object('a');
    testObj.y = 1;
    object_keys_x_esm_res = attempt_x_esm(nativeKeys, testObj);
    object_keys_x_esm_isWorking = object_keys_x_esm_isCorrectRes(object_keys_x_esm_res, 2) && either(object_keys_x_esm_res, '0', 'y');
  }

  if (object_keys_x_esm_isWorking) {
    throwsWithNull = attempt_x_esm(nativeKeys, null).threw;
    object_keys_x_esm_worksWithPrim = object_keys_x_esm_isCorrectRes(attempt_x_esm(nativeKeys, 42), 0);
    worksWithRegex = attempt_x_esm(nativeKeys, /a/g).threw === false;
    object_keys_x_esm_res = attempt_x_esm(nativeKeys, function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2));
    worksWithArgs = object_keys_x_esm_isCorrectRes(object_keys_x_esm_res, 2) && either(object_keys_x_esm_res, '0', '1');
    object_keys_x_esm_res = attempt_x_esm(nativeKeys, Object('ab'));
    object_keys_x_esm_worksWithStr = object_keys_x_esm_isCorrectRes(object_keys_x_esm_res, 2) && either(object_keys_x_esm_res, '0', '1');
  }
}

var patched = function keys(object) {
  var obj = to_object_x_esm ? to_object_x_esm(object) : object;

  if (worksWithArgs !== true && is_arguments_default()(obj)) {
    obj = array_like_slice_x_esm(obj);
  } else if (object_keys_x_esm_worksWithStr !== true && is_string_default()(obj)) {
    obj = split_if_boxed_bug_x_esm(obj);
  } else if (worksWithRegex !== true && is_regexp_x_esm(obj)) {
    var regexKeys = [];
    /* eslint-disable-next-line no-restricted-syntax */

    for (var key in obj) {
      // noinspection JSUnfilteredForInLoop
      if (has_own_property_x_esm(obj, key)) {
        regexKeys[regexKeys.length] = key;
      }
    }

    return regexKeys;
  }

  return nativeKeys(obj);
};
var object_keys_x_esm_implementation = function keys(object) {
  return object_keys_default()(to_object_x_esm(object));
};
var objectKeys;

if (object_keys_x_esm_isWorking) {
  if (throwsWithNull && object_keys_x_esm_worksWithPrim && worksWithRegex && worksWithArgs && object_keys_x_esm_worksWithStr) {
    objectKeys = nativeKeys;
  } else {
    objectKeys = patched;
  }
}
/**
 * This method returns an array of a given object's own enumerable properties,
 * in the same order as that provided by a for...in loop (the difference being
 * that a for-in loop enumerates properties in the prototype chain as well).
 *
 * @param {*} obj - The object of which the enumerable own properties are to be returned.
 * @returns {Array} An array of strings that represent all the enumerable properties of the given object.
 */


var $objectKeys = object_keys_x_esm_isWorking ? objectKeys : object_keys_x_esm_implementation;
/* harmony default export */ var object_keys_x_esm = ($objectKeys);


// CONCATENATED MODULE: ./dist/deep-equal-x.esm.js
function deep_equal_x_esm_slicedToArray(arr, i) { return deep_equal_x_esm_arrayWithHoles(arr) || deep_equal_x_esm_iterableToArrayLimit(arr, i) || deep_equal_x_esm_nonIterableRest(); }

function deep_equal_x_esm_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function deep_equal_x_esm_iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function deep_equal_x_esm_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






















 // Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)

var hasBoxedStringBug = has_boxed_string_x_esm === false; // Used to detect unsigned integer values.

var deep_equal_x_esm_reIsUint = /^(?:0|[1-9]\d*)$/;
var deep_equal_x_esm_methodizedTest = simple_methodize_x_esm(deep_equal_x_esm_reIsUint.test);
var methodizedRxToString = simple_methodize_x_esm(deep_equal_x_esm_reIsUint.toString);
var getTime = simple_methodize_x_esm(Date.prototype.getTime);
var deep_equal_x_esm_charAt = simple_methodize_x_esm(''.charAt);
var tempArray = [];
var push = simple_methodize_x_esm(tempArray.push);
var pop = simple_methodize_x_esm(tempArray.pop);
/* eslint-disable-next-line compat/compat */

var hasMapEnumerables = typeof Map === 'function' ? object_keys_x_esm(new Map()) : [];
/* eslint-disable-next-line compat/compat */

var hasSetEnumerables = typeof Set === 'function' ? object_keys_x_esm(new Set()) : [];
var hasErrorEnumerables;

try {
  // noinspection ExceptionCaughtLocallyJS
  throw new Error('a');
} catch (e) {
  hasErrorEnumerables = object_keys_x_esm(e);
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

var deep_equal_x_esm_isIndex = function isIndex(value) {
  var num = indexNotFound;

  if (deep_equal_x_esm_methodizedTest(deep_equal_x_esm_reIsUint, value)) {
    num = to_number_x_esm(value);
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
 * @param args
 * @param {boolean} isIdx - Is the `key` a character index.
 * @returns {*} Returns the `value` referenced by the `key`.
 */
// eslint-enable jsdoc/require-param


var getItem = function getItem(args) {
  var _args = deep_equal_x_esm_slicedToArray(args, 4),
      object = _args[0],
      key = _args[1],
      isStr = _args[2],
      isIdx = _args[3];

  return isStr && isIdx ? deep_equal_x_esm_charAt(key, object) : object[key];
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


var deep_equal_x_esm_filterUnwanted = function filterUnwanted(keys, unwanted) {
  return unwanted.length ? array_filter_x_esm(keys, function predicate(key) {
    return index_of_x_esm(unwanted, key) === indexNotFound;
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
 * @param args
 * @param {object} previousStack - The circular stack.
 * @returns {boolean} `true` if `actual` and `expected` are deemed equal,
 * otherwise `false`.
 */
// eslint-enable jsdoc/require-param


var deep_equal_x_esm_baseDeepEqual = function baseDeepEqual(args) {
  var _args2 = deep_equal_x_esm_slicedToArray(args, 4),
      actual = _args2[0],
      expected = _args2[1],
      strict = _args2[2],
      previousStack = _args2[3]; // 7.1. All identical values are equivalent, as determined by ===.


  if (actual === expected) {
    return true;
  }

  if (is_buffer_default()(actual) && is_buffer_default()(expected)) {
    return actual.length === expected.length && array_some_x_esm(actual, function predicate(item, index) {
      return item !== expected[index];
    }) === false;
  } // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.


  if (is_date_object_default()(actual) && is_date_object_default()(expected)) {
    return getTime(actual) === getTime(expected);
  } // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same `source` and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase` & `sticky`).


  if (is_regexp_x_esm(actual) && is_regexp_x_esm(expected)) {
    return methodizedRxToString(actual) === methodizedRxToString(expected) && actual.lastIndex === expected.lastIndex;
  } // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by == or strict ===.


  if (is_object_default()(actual) === false && is_object_default()(expected) === false) {
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


  if (is_nil_x_esm(actual) || is_nil_x_esm(expected)) {
    return false;
  }
  /* jshint eqnull:false */
  // This only considers enumerable properties. It does not test object
  // prototypes, attached symbols, or non-enumerable properties. This can
  // lead to some potentially surprising results.


  if (strict && get_prototype_of_x_esm(actual) !== get_prototype_of_x_esm(expected)) {
    return false;
  } // if one is actual primitive, the other must be same


  if (is_primitive_x_esm(actual) || is_primitive_x_esm(expected)) {
    return actual === expected;
  }

  var ka = is_arguments_default()(actual);
  var kb = is_arguments_default()(expected);
  var aNotB = ka && kb === false;
  var bNotA = ka === false && kb;

  if (aNotB || bNotA) {
    return false;
  }

  if (ka) {
    if (ka.length !== kb.length) {
      return false;
    }

    return baseDeepEqual([array_slice_x_esm(actual), array_slice_x_esm(expected), strict, null]);
  }

  ka = object_keys_x_esm(actual);
  kb = object_keys_x_esm(expected); // having the same number of owned properties (keys incorporates hasOwnProperty)

  if (ka.length !== kb.length) {
    return false;
  }

  if (is_object_default()(actual)) {
    if (is_error_x_esm(actual)) {
      ka = deep_equal_x_esm_filterUnwanted(ka, hasErrorEnumerables);
    } else if (is_map_x_esm(actual)) {
      ka = deep_equal_x_esm_filterUnwanted(ka, hasMapEnumerables);
    } else if (is_set_x_esm(actual)) {
      ka = deep_equal_x_esm_filterUnwanted(ka, hasSetEnumerables);
    }
  }

  if (is_object_default()(expected)) {
    if (is_error_x_esm(expected)) {
      kb = deep_equal_x_esm_filterUnwanted(kb, hasErrorEnumerables);
    } else if (is_map_x_esm(expected)) {
      kb = deep_equal_x_esm_filterUnwanted(kb, hasMapEnumerables);
    } else if (is_set_x_esm(expected)) {
      kb = deep_equal_x_esm_filterUnwanted(kb, hasSetEnumerables);
    }
  } // the same set of keys (although not necessarily the same order),


  stable_default.a.inplace(ka);
  stable_default.a.inplace(kb);
  var aIsString;
  var bIsString;

  if (hasBoxedStringBug) {
    aIsString = is_string_default()(actual);
    bIsString = is_string_default()(expected);
  } // ~~~cheap key test
  // equivalent values for every corresponding key, and
  // ~~~possibly expensive deep test


  return array_some_x_esm(ka, function predicate(key, index) {
    if (key !== kb[index]) {
      return true;
    }

    var isIdx = (aIsString || bIsString) && deep_equal_x_esm_isIndex(key);
    var stack = previousStack || [actual];
    var item = getItem([actual, key, aIsString, isIdx]);
    var isPrim = is_primitive_x_esm(item);

    if (isPrim === false) {
      if (index_of_x_esm(stack, item) !== indexNotFound) {
        throw new RangeError('Circular object');
      }

      push(stack, item);
    }

    var result = baseDeepEqual([item, getItem([expected, key, bIsString, isIdx]), strict, stack]) === false;

    if (isPrim === false) {
      pop(stack);
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


var deep_equal_x_esm_deepEqual = function deepEqual(actual, expected) {
  /* eslint-disable-next-line prefer-rest-params */
  return deep_equal_x_esm_baseDeepEqual([actual, expected, to_boolean_x_esm(arguments[2])]);
};

/* harmony default export */ var deep_equal_x_esm = __webpack_exports__["default"] = (deep_equal_x_esm_deepEqual);



/***/ })
/******/ ]);
});
//# sourceMappingURL=deep-equal-x.js.map