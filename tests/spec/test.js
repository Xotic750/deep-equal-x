/*jslint maxlen:80, es6:true, this:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:true, plusplus:true, maxparams:2, maxdepth:2,
  maxstatements:37, maxcomplexity:7 */

/*global expect, module, require, jasmine, describe, it, xit, returnExports*/

(function () {
  'use strict';

  var ifBufferSupport = typeof Buffer === 'function' ? it : xit,
    ifArrayBufferSupport = typeof ArrayBuffer === 'function' ? it : xit,
    ifSymbolSupport = typeof Symbol === 'function' &&
      typeof Symbol() === 'symbol' ? it : xit,
    ifMapSupport = typeof Map !== 'undefined' ? it : xit,
    ifSetSupport = typeof Set !== 'undefined' ? it : xit,
    deepEqual;

  if (typeof module === 'object' && module.exports) {
    require('es5-shim');
    deepEqual = require('../../index.js');
  } else {
    deepEqual = returnExports;
  }

  describe('deepEqual - 7.2', function () {
    it('Dates', function () {
      expect(deepEqual(new Date(), new Date(2000, 3, 14))).toBe(false);

      expect(
        deepEqual(new Date(2000, 3, 14), new Date(2000, 3, 14))
      ).toBe(true);
    });
  });

  describe('deepEqual - 7.3', function () {
    it('RegExps', function () {
      var re1 = /a/;
      re1.lastIndex = 3;

      expect(deepEqual(/ab/, /a/)).toBe(false);
      expect(deepEqual(/a/g, /a/)).toBe(false);
      expect(deepEqual(/a/i, /a/)).toBe(false);
      expect(deepEqual(/a/m, /a/)).toBe(false);
      expect(deepEqual(/a/igm, /a/im)).toBe(false);
      expect(deepEqual(re1, /a/)).toBe(false);

      re1.lastIndex = 0;
      expect(deepEqual(re1, /a/)).toBe(true);
      expect(deepEqual(/a/, /a/)).toBe(true);
      expect(deepEqual(/a/g, /a/g)).toBe(true);
      expect(deepEqual(/a/i, /a/i)).toBe(true);
      expect(deepEqual(/a/m, /a/m)).toBe(true);
      expect(deepEqual(/a/igm, /a/igm)).toBe(true);
    });
  });

  describe('deepEqual - 7.4', function () {
    it('`==` equality', function () {
      expect(deepEqual(4, '5')).toBe(false);
      expect(deepEqual(4, '4')).toBe(true);
      expect(deepEqual(true, 1)).toBe(true);
    });
  });

  describe('deepEqual - 7.5', function () {
    it('own properties & keys (not necessarily the same order)', function () {
      var a1 = [1, 2, 3],
          a2 = [1, 2, 3];
      a1.a = 'test';
      a1.b = true;
      a2.b = true;
      a2.a = 'test';

      expect(deepEqual({
          a: 4
        }, {
          a: 4,
          b: true
        })).toBe(false);

      expect(deepEqual(Object.keys(a1), Object.keys(a2))).toBe(false);

      expect(deepEqual({
        a: 4
      }, {
        a: 4
      })).toBe(true);

      expect(deepEqual({
        a: 4,
        b: '2'
      }, {
        a: 4,
        b: '2'
      })).toBe(true);

      expect(deepEqual([4], ['4'])).toBe(true);
      expect(deepEqual(['a'], {
        0: 'a'
      })).toBe(true);

      expect(deepEqual({
        a: 4,
        b: '1'
      }, {
        b: '1',
        a: 4
      })).toBe(true);

      expect(deepEqual(a1, a2)).toBe(true);
      a1.d = 1;
      a2.c = 1;
      expect(deepEqual(a1, a2)).toBe(false);
    });
  });

  describe('deepEqual - instances', function () {
    /**
     * Test constructor 1.
     *
     * @private
     * @constructor
     * @param {string} first A persons first name.
     * @param {string} last A persons last name.
     */
    function NameBuilder1(first, last) {
      this.first = first;
      this.last = last;
    }

    NameBuilder1.prototype = {
      /**
       * Get a string representation of the object.
       *
       * @private
       * @return {string} Full name.
       */
      toString: function () {
        return this.first + ' ' + this.last;
      }
    };

    /**
     * Test constructor 2.
     *
     * @private
     * @constructor
     * @param {string} first A persons first name.
     * @param {string} last A persons last name.
     */
    function NameBuilder2(first, last) {
      this.first = first;
      this.last = last;
    }

    NameBuilder2.prototype = Object;

    it('prototype property comparison', function () {
      var nb1, nb2;
      nb1 = new NameBuilder1('John', 'Smith');
      nb2 = new NameBuilder2('John', 'Smith');
      expect(deepEqual(nb1, nb2)).toBe(false);
      expect(deepEqual('a', {})).toBe(false);

      NameBuilder2.prototype = NameBuilder1.prototype;
      nb1 = new NameBuilder1('John', 'Smith');
      nb2 = new NameBuilder2('John', 'Smith');
      expect(deepEqual(nb1, nb2)).toBe(true);
    });
  });

  describe('deepEqual - ES6 primitives', function () {
    it('compared to similar objects', function () {
      expect(deepEqual(null, {})).toBe(false);
      expect(deepEqual(undefined, {})).toBe(false);
      expect(deepEqual('a', ['a'])).toBe(false);
      expect(deepEqual('a', {0: 'a'})).toBe(false);
      expect(deepEqual(1, {})).toBe(false);
      expect(deepEqual(true, {})).toBe(false);
    });
  });

  describe('deepEqual - ES6 symbols', function () {
    ifSymbolSupport('compared to similar objects', function () {
      expect(deepEqual(Symbol(), {})).toBe(false);
    });
  });

  describe('deepEqual - object wrappers', function () {
    it('when comparing similar objects', function () {
      expect(deepEqual(Object('a'), ['a'])).toBe(true);
      expect(deepEqual(Object('a'), {0: 'a'})).toBe(true);
      expect(deepEqual(Object(1), {})).toBe(true);
      expect(deepEqual(Object(true), {})).toBe(true);
    });
  });

  describe('deepEqual - Buffer', function () {
    ifBufferSupport('comparing two buffers', function () {
      var b1 = new Buffer([1, 2, 3]),
        b2 = new Buffer([1, 2, 3]),
        b3 = new Buffer([1, 2]);
      expect(deepEqual(b1, b1)).toBe(true);
      expect(deepEqual(b1, b2)).toBe(true);
      expect(deepEqual(b1, b3)).toBe(false);
    });
  });

  describe('deepEqual - ArrayBuffer', function () {
    ifArrayBufferSupport('comparing two array buffers', function () {
      var b1 = new Int32Array([1, 2, 3]),
        b2 = new Int32Array([1, 2, 3]),
        b3 = new Int32Array([1, 2]);
      expect(deepEqual(b1, b1)).toBe(true);
      expect(deepEqual(b1, b2)).toBe(true);
      expect(deepEqual(b1, b3)).toBe(false);
    });
  });

  describe('deepEqual - Map', function () {
    ifMapSupport('comparing two maps', function () {
      var m1 = new Map(),
        m2 = new Map();
      m1.set(1, 2);
      m1.set(2, 3);
      m2.set(1, 2);
      expect(deepEqual(m1, m1)).toBe(true);
      expect(deepEqual(m1, m2)).toBe(true);
    });
  });

  describe('deepEqual - Set', function () {
    ifSetSupport('comparing two set', function () {
      var s1 = new Set(),
        s2 = new Set();
      s1.add(1);
      s1.add(2);
      s2.add(1);
      expect(deepEqual(s1, s1)).toBe(true);
      expect(deepEqual(s1, s2)).toBe(true);
    });
  });

  describe('deepEqual - non circular refs', function () {
    it('make sure stack works', function () {
      var b = {
          s: '',
          t: true,
          u: undefined,
          v: 1,
          w: null
        },
        c = {
          s: '',
          t: true,
          u: undefined,
          v: 1,
          w: null
        };
      expect(deepEqual(b, c)).toBe(true);
    });
  });

  describe('deepEqual - circular refs', function () {
    it('make sure it doesn\'t loop forever', function () {
      var b = {
          s: '',
          t: true,
          u: undefined,
          v: 1,
          w: null
        },
        c = {
          s: '',
          t: true,
          u: undefined,
          v: 1,
          w: null
        },
        gotError = false;

      b.b = b;
      c.b = c;

      try {
        deepEqual(b, c);
      } catch (e) {
        gotError = true;
        expect(e).toEqual(jasmine.any(RangeError));
        expect(e.message).toBe('Circular reference');
      }

      expect(gotError).toBe(true);
    });
  });

  describe('deepEqual - reflexivity', function () {
    it('`arguments` objects', function () {
      var args = (function () {
        return arguments;
      }());
      expect(deepEqual([], args)).toBe(false);
      expect(deepEqual(args, [])).toBe(false);
    });
  });

  describe('deepEqual - arguments', function () {
    it('comparing same type objects', function () {
      var args1 = (function () {
          return arguments;
        }(1, 2, 3)),
        args2 = (function () {
          return arguments;
        }(1, 2, 3)),
        args3 = (function () {
          return arguments;
        }(1, 3, 4));
      expect(deepEqual(args1, args1)).toBe(true);
      expect(deepEqual(args1, args2)).toBe(true);
      expect(deepEqual(args1, args3)).toBe(false);
    });
  });

  describe('deepEqual - Examples from node\'s documentation', function () {
    it('prototypes, symbols, or non-enumerable properties', function () {
      // WARNING: This does not throw an AssertionError!
      expect(deepEqual(Error('a'), Error('b'))).toBe(true);
    });
  });

  // strict

  describe('deepEqual:strict - 7.2', function () {
    it('Dates', function () {
      expect(deepEqual(new Date(), new Date(2000, 3, 14), true)).toBe(false);

      expect(
        deepEqual(new Date(2000, 3, 14), new Date(2000, 3, 14), true)
      ).toBe(true);
    });
  });

  describe('deepEqual:strict - 7.3', function () {
    it('RegExps', function () {
      var re1 = /a/;
      re1.lastIndex = 3;

      expect(deepEqual(/ab/, /a/, true)).toBe(false);
      expect(deepEqual(/a/g, /a/, true)).toBe(false);
      expect(deepEqual(/a/i, /a/, true)).toBe(false);
      expect(deepEqual(/a/m, /a/, true)).toBe(false);
      expect(deepEqual(/a/igm, /a/im, true)).toBe(false);
      expect(deepEqual(re1, /a/, true)).toBe(false);

      re1.lastIndex = 0;
      expect(deepEqual(re1, /a/, true)).toBe(true);
      expect(deepEqual(/a/, /a/, true)).toBe(true);
      expect(deepEqual(/a/g, /a/g, true)).toBe(true);
      expect(deepEqual(/a/i, /a/i, true)).toBe(true);
      expect(deepEqual(/a/m, /a/m, true)).toBe(true);
      expect(deepEqual(/a/igm, /a/igm, true)).toBe(true);
    });
  });

  describe('deepEqual:strict - 7.4', function () {
    it('`===` equality', function () {
      expect(deepEqual(4, '5', true)).toBe(false);
      expect(deepEqual(4, '4', true)).toBe(false);
      expect(deepEqual(true, 1, true)).toBe(false);
    });
  });

  describe('deepEqual:strict - 7.5', function () {
    it('own properties & keys (not necessarily the same order)', function () {
      var a1 = [1, 2, 3],
          a2 = [1, 2, 3];
      a1.a = 'test';
      a1.b = true;
      a2.b = true;
      a2.a = 'test';

      expect(deepEqual({
          a: 4
        }, {
          a: 4,
          b: true
        }, true)).toBe(false);

      expect(deepEqual(Object.keys(a1), Object.keys(a2), true)).toBe(false);

      expect(deepEqual({
        a: 4
      }, {
        a: 4
      }, true)).toBe(true);

      expect(deepEqual({
        a: 4
      }, {
        a: '4'
      }, true)).toBe(false);

      expect(deepEqual({
        a: 4,
        b: '2'
      }, {
        a: 4,
        b: '2'
      }, true)).toBe(true);

      expect(deepEqual([4], ['4'], true)).toBe(false);
      expect(deepEqual(['a'], {
        0: 'a'
      }, true)).toBe(true);

      expect(deepEqual({
        a: 4,
        b: '1'
      }, {
        b: '1',
        a: 4
      }, true)).toBe(true);

      expect(deepEqual(a1, a2, true)).toBe(true);
      a1.d = 1;
      a2.c = 1;
      expect(deepEqual(a1, a2)).toBe(false);
    });
  });

  describe('deepEqual:strict - instances', function () {
    /**
     * Test constructor 1.
     *
     * @private
     * @constructor
     * @param {string} first A persons first name.
     * @param {string} last A persons last name.
     */
    function NameBuilder1(first, last) {
      this.first = first;
      this.last = last;
    }

    NameBuilder1.prototype = {
      /**
       * Get a string representation of the object.
       *
       * @private
       * @return {string} Full name.
       */
      toString: function () {
        return this.first + ' ' + this.last;
      }
    };

    /**
     * Test constructor 2.
     *
     * @private
     * @constructor
     * @param {string} first A persons first name.
     * @param {string} last A persons last name.
     */
    function NameBuilder2(first, last) {
      this.first = first;
      this.last = last;
    }

    NameBuilder2.prototype = Object;

    it('prototype property comparison', function () {
      var nb1, nb2;
      nb1 = new NameBuilder1('John', 'Smith');
      nb2 = new NameBuilder2('John', 'Smith');
      expect(deepEqual(nb1, nb2, true)).toBe(false);
      expect(deepEqual('a', {}, true)).toBe(false);

      NameBuilder2.prototype = NameBuilder1.prototype;
      nb1 = new NameBuilder1('John', 'Smith');
      nb2 = new NameBuilder2('John', 'Smith');
      expect(deepEqual(nb1, nb2, true)).toBe(true);
    });
  });

  describe('deepEqual:strict - ES6 primitives', function () {
    it('compared to similar objects', function () {
      expect(deepEqual(null, {}, true)).toBe(false);
      expect(deepEqual(undefined, {}, true)).toBe(false);
      expect(deepEqual('a', ['a'], true)).toBe(false);
      expect(deepEqual('a', {0: 'a'}, true)).toBe(false);
      expect(deepEqual(1, {}, true)).toBe(false);
      expect(deepEqual(true, {}, true)).toBe(false);
    });
  });

  describe('deepEqual:strict - ES6 symbols', function () {
    ifSymbolSupport('compared to similar objects', function () {
      expect(deepEqual(Symbol(), {}, true)).toBe(false);
    });
  });

  describe('deepEqual:strict - object wrappers', function () {
    it('when comparing similar objects', function () {
      expect(deepEqual(Object('a'), ['a'], true)).toBe(true);
      expect(deepEqual(Object('a'), {0: 'a'}, true)).toBe(true);
      expect(deepEqual(Object(1), {}, true)).toBe(true);
      expect(deepEqual(Object(true), {}, true)).toBe(true);
    });
  });

  describe('deepEqual:strict - non circular refs', function () {
    it('make sure stack works', function () {
      var b = {
          s: '',
          t: true,
          u: undefined,
          v: 1,
          w: null
        },
        c = {
          s: '',
          t: true,
          u: undefined,
          v: 1,
          w: null
        };
      expect(deepEqual(b, c, true)).toBe(true);
    });
  });

  describe('deepEqual:strict - circular refs', function () {
    it('make sure it doesn\'t loop forever', function () {
      var b = {
          s: '',
          t: true,
          u: undefined,
          v: 1,
          w: null
        },
        c = {
          s: '',
          t: true,
          u: undefined,
          v: 1,
          w: null
        },
        gotError = false;

      b.b = b;
      c.b = c;

      try {
        deepEqual(b, c, true);
      } catch (e) {
        gotError = true;
        expect(e).toEqual(jasmine.any(RangeError));
        expect(e.message).toBe('Circular reference');
      }

      expect(gotError).toBe(true);
    });
  });

  describe('deepEqual:strict - Buffer', function () {
    ifBufferSupport('comparing two buffers', function () {
      var b1 = new Buffer([1, 2, 3]),
        b2 = new Buffer([1, 2, 3]),
        b3 = new Buffer([1, 2]);
      expect(deepEqual(b1, b1, true)).toBe(true);
      expect(deepEqual(b1, b2, true)).toBe(true);
      expect(deepEqual(b1, b3, true)).toBe(false);
    });
  });

  describe('deepEqual:strict - ArrayBuffer', function () {
    ifArrayBufferSupport('comparing two array buffers', function () {
      var b1 = new Int32Array([1, 2, 3]),
        b2 = new Int32Array([1, 2, 3]),
        b3 = new Int32Array([1, 2]);
      expect(deepEqual(b1, b1, true)).toBe(true);
      expect(deepEqual(b1, b2, true)).toBe(true);
      expect(deepEqual(b1, b3, true)).toBe(false);
    });
  });

  describe('deepEqual:strict - Map', function () {
    ifMapSupport('comparing two maps', function () {
      var m1 = new Map(),
        m2 = new Map();
      m1.set(1, 2);
      m1.set(2, 3);
      m2.set(1, 2);
      expect(deepEqual(m1, m1, true)).toBe(true);
      expect(deepEqual(m1, m2, true)).toBe(true);
    });
  });

  describe('deepEqual:strict - Set', function () {
    ifSetSupport('comparing two set', function () {
      var s1 = new Set(),
        s2 = new Set();
      s1.add(1);
      s1.add(2);
      s2.add(1);
      expect(deepEqual(s1, s1, true)).toBe(true);
      expect(deepEqual(s1, s2, true)).toBe(true);
    });
  });

  describe('deepEqual:strict - reflexivity', function () {
    it('`arguments` objects', function () {
      var args = (function () {
        return arguments;
      }());
      expect(deepEqual([], args), true).toBe(false);
      expect(deepEqual(args, []), true).toBe(false);
    });
  });

  describe('deepEqual:strict - arguments', function () {
    it('comparing same type objects', function () {
      var args1 = (function () {
          return arguments;
        }(1, 2, 3)),
        args2 = (function () {
          return arguments;
        }(1, 2, 3)),
        args3 = (function () {
          return arguments;
        }(1, 3, 4));
      expect(deepEqual(args1, args1)).toBe(true);
      expect(deepEqual(args1, args2)).toBe(true);
      expect(deepEqual(args1, args3)).toBe(false);
    });
  });

  describe('deepEqual:strict - Examples from documentation', function () {
    it('prototypes, symbols, or non-enumerable properties', function () {
      // WARNING: This does not throw an AssertionError!
      expect(deepEqual(Error('a'), Error('b'), true)).toBe(true);
    });
  });
}());
