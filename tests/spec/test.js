/*jslint maxlen:80, es6:false, this:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:true, plusplus:true, maxparams:2, maxdepth:2,
  maxstatements:39, maxcomplexity:4 */

/*global expect, module, require, describe, it, returnExports, JSON:true */

(function () {
  'use strict';

  var deepEqual;

  if (typeof module === 'object' && module.exports) {
    require('es5-shim');
    if (typeof JSON === 'undefined') {
      JSON = {};
    }
    require('json3').runInContext(null, JSON);
    require('es6-shim');
    deepEqual = require('../../index.js').deepEqual;
  } else {
    deepEqual = returnExports.deepEqual;
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
    });
  });

  describe('deepEqual - instances', function () {
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
      if (typeof Symbol === 'symbol') {
        expect(deepEqual(Symbol(), {})).toBe(false);
      }
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

  describe('deepEqual - circular refs', function () {
    it('make sure it doesn\'t loop forever', function () {
      var b = {},
        c = {},
        gotError = false;

      b.b = b;
      c.b = c;

      try {
        deepEqual(b, c);
      } catch (e) {
        gotError = true;
      }

      expect(gotError).toBe(true);
    });
  });

  describe('deepEqual - reflexivity', function () {
    it('`arguments` objects', function () {
      var args = (function () {
        return arguments;
      })();
      expect(deepEqual([], args)).toBe(false);
      expect(deepEqual(args, [])).toBe(false);
    });
  });

  describe('deepEqual - Examples from node\'s documentation', function () {
    it('prototypes, symbols, or non-enumerable properties', function () {
      // WARNING: This does not throw an AssertionError!
      expect(deepEqual(Error('a'), Error('b'))).toBe(true);
    });
  });
}());
