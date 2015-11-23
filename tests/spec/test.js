/*jslint maxlen:80, es6:false, this:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:true, plusplus:true, maxparams:2, maxdepth:2,
  maxstatements:39, maxcomplexity:4 */

/*global expect, module, require, describe, it, returnExports, JSON:true */

(function () {
  'use strict';

  var lib;

  if (typeof module === 'object' && module.exports) {
    require('es5-shim');
    if (typeof JSON === 'undefined') {
      JSON = {};
    }
    require('json3').runInContext(null, JSON);
    lib = require('../../index.js');
  } else {
    lib = returnExports;
  }

  describe('lib.deepEqual - 7.2', function () {
    it('Dates', function () {
      expect(lib.deepEqual(new Date(), new Date(2000, 3, 14))).toBe(false);

      expect(
        lib.deepEqual(new Date(2000, 3, 14), new Date(2000, 3, 14))
      ).toBe(true);
    });
  });

  describe('lib.deepEqual - 7.3', function () {
    it('RegExps', function () {
      var re1 = /a/;
      re1.lastIndex = 3;

      expect(lib.deepEqual(/ab/, /a/)).toBe(false);
      expect(lib.deepEqual(/a/g, /a/)).toBe(false);
      expect(lib.deepEqual(/a/i, /a/)).toBe(false);
      expect(lib.deepEqual(/a/m, /a/)).toBe(false);
      expect(lib.deepEqual(/a/igm, /a/im)).toBe(false);
      expect(lib.deepEqual(re1, /a/)).toBe(false);

      re1.lastIndex = 0;
      expect(lib.deepEqual(re1, /a/)).toBe(true);
      expect(lib.deepEqual(/a/, /a/)).toBe(true);
      expect(lib.deepEqual(/a/g, /a/g)).toBe(true);
      expect(lib.deepEqual(/a/i, /a/i)).toBe(true);
      expect(lib.deepEqual(/a/m, /a/m)).toBe(true);
      expect(lib.deepEqual(/a/igm, /a/igm)).toBe(true);
    });
  });

  describe('lib.deepEqual - 7.4', function () {
    it('`==` equality', function () {
      expect(lib.deepEqual(4, '5')).toBe(false);
      expect(lib.deepEqual(4, '4')).toBe(true);
      expect(lib.deepEqual(true, 1)).toBe(true);
    });
  });

  describe('lib.deepEqual - 7.5', function () {
    it('own properties & keys (not necessarily the same order)', function () {
      var a1 = [1, 2, 3],
          a2 = [1, 2, 3];
      a1.a = 'test';
      a1.b = true;
      a2.b = true;
      a2.a = 'test';

      expect(lib.deepEqual({
          a: 4
        }, {
          a: 4,
          b: true
        })).toBe(false);

      expect(lib.deepEqual(Object.keys(a1), Object.keys(a2))).toBe(false);

      expect(lib.deepEqual({
        a: 4
      }, {
        a: 4
      })).toBe(true);

      expect(lib.deepEqual({
        a: 4,
        b: '2'
      }, {
        a: 4,
        b: '2'
      })).toBe(true);

      expect(lib.deepEqual([4], ['4'])).toBe(true);
      expect(lib.deepEqual(['a'], {
        0: 'a'
      })).toBe(true);

      expect(lib.deepEqual({
        a: 4,
        b: '1'
      }, {
        b: '1',
        a: 4
      })).toBe(true);

      expect(lib.deepEqual(a1, a2)).toBe(true);
    });
  });

  describe('lib.deepEqual - instances', function () {
    function NameBuilder1(first, last) {
      this.first = first;
      this.last = last;
    }

    NameBuilder1.prototype = {
      toString: function () {
        return this.first + ' ' + this.last;
      }
    };

    function NameBuilder2(first, last) {
      this.first = first;
      this.last = last;
    }

    NameBuilder2.prototype = Object;

    it('prototype property comparison', function () {
      var nb1, nb2;
      nb1 = new NameBuilder1('John', 'Smith');
      nb2 = new NameBuilder2('John', 'Smith');
      expect(lib.deepEqual(nb1, nb2)).toBe(false);
      expect(lib.deepEqual('a', {})).toBe(false);

      NameBuilder2.prototype = NameBuilder1.prototype;
      nb1 = new NameBuilder1('John', 'Smith');
      nb2 = new NameBuilder2('John', 'Smith');
      expect(lib.deepEqual(nb1, nb2)).toBe(true);
    });
  });

  describe('lib.deepEqual - ES6 primitives', function () {
    it('compared to similar objects', function () {
      expect(lib.deepEqual(null, {})).toBe(false);
      expect(lib.deepEqual(undefined, {})).toBe(false);
      expect(lib.deepEqual('a', ['a'])).toBe(false);
      expect(lib.deepEqual('a', {0: 'a'})).toBe(false);
      expect(lib.deepEqual(1, {})).toBe(false);
      expect(lib.deepEqual(true, {})).toBe(false);
      if (typeof Symbol === 'symbol') {
        expect(lib.deepEqual(Symbol(), {})).toBe(false);
      }
    });
  });

  describe('lib.deepEqual - object wrappers', function () {
    it('when comparing similar objects', function () {
      expect(lib.deepEqual(Object('a'), ['a'])).toBe(true);
      expect(lib.deepEqual(Object('a'), {0: 'a'})).toBe(true);
      expect(lib.deepEqual(Object(1), {})).toBe(true);
      expect(lib.deepEqual(Object(true), {})).toBe(true);
    });
  });

  describe('lib.deepEqual - circular refs', function () {
    it('make sure it doesn\'t loop forever', function () {
      var b = {},
        c = {},
        gotError = false;

      b.b = b;
      c.b = c;

      try {
        lib.deepEqual(b, c);
      } catch (e) {
        gotError = true;
      }

      expect(gotError).toBe(true);
    });
  });

  describe('lib.deepEqual - reflexivity', function () {
    it('`arguments` objects', function () {
      var args = (function () {
        return arguments;
      })();
      expect(lib.deepEqual([], args)).toBe(false);
      expect(lib.deepEqual(args, [])).toBe(false);
    });
  });

  describe('lib.deepEqual - Examples from node\'s documentation' ,function () {
    it('prototypes, symbols, or non-enumerable properties', function () {
      // WARNING: This does not throw an AssertionError!
      expect(lib.deepEqual(Error('a'), Error('b'))).toBe(true);
    });
  });
}());
