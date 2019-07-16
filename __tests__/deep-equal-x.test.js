/* global ArrayBuffer, Int32Array */

let deepEqual;

if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');

  if (typeof JSON === 'undefined') {
    JSON = {};
  }

  require('json3').runInContext(null, JSON);
  require('es6-shim');
  const es7 = require('es7-shim');
  Object.keys(es7).forEach(function(key) {
    const obj = es7[key];

    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  deepEqual = require('../../index.js');
} else {
  deepEqual = returnExports;
}

const hasBuffer = typeof Buffer === 'function';
const ifBufferSupport = hasBuffer ? it : xit;
let bufferFrom;

if (hasBuffer) {
  if (typeof Buffer.from === 'function') {
    bufferFrom = Buffer.from;
  }

  try {
    bufferFrom([1, 2, 3]);
  } catch (e) {
    bufferFrom = function from(value) {
      // eslint-disable-next-line no-buffer-constructor
      return new Buffer(value);
    };
  }
}

const ifArrayBufferSupport = typeof ArrayBuffer === 'function' ? it : xit;
const ifSymbolSupport = typeof Symbol === 'function' && typeof Symbol('') === 'symbol' ? it : xit;
const ifMapSupport = typeof Map === 'undefined' ? xit : it;
const ifSetSupport = typeof Set === 'undefined' ? xit : it;

const returnArgs = function() {
  return arguments;
};

describe('deepEqual', function() {
  describe('7.2', function() {
    it('dates', function() {
      expect.assertions(1);
      expect.assertions(1);
      expect(deepEqual(new Date(), new Date(2000, 3, 14))).toBe(false);
      expect(deepEqual(new Date(2000, 3, 14), new Date(2000, 3, 14))).toBe(true);
    });
  });

  describe('7.3', function() {
    it('regExps', function() {
      expect.assertions(1);
      expect.assertions(1);
      const re1 = /a/;
      re1.lastIndex = 3;

      expect(deepEqual(/ab/, /a/)).toBe(false);
      expect(deepEqual(/a/g, /a/)).toBe(false);
      expect(deepEqual(/a/i, /a/)).toBe(false);
      expect(deepEqual(/a/m, /a/)).toBe(false);
      expect(deepEqual(/a/gim, /a/im)).toBe(false);
      expect(deepEqual(re1, /a/)).toBe(false);

      re1.lastIndex = 0;
      expect(deepEqual(re1, /a/)).toBe(true);
      expect(deepEqual(/a/, /a/)).toBe(true);
      expect(deepEqual(/a/g, /a/g)).toBe(true);
      expect(deepEqual(/a/i, /a/i)).toBe(true);
      expect(deepEqual(/a/m, /a/m)).toBe(true);
      expect(deepEqual(/a/gim, /a/gim)).toBe(true);
    });
  });

  describe('7.4', function() {
    it('`==` equality', function() {
      expect.assertions(1);
      expect.assertions(1);
      expect(deepEqual(4, '5')).toBe(false);
      expect(deepEqual(4, '4')).toBe(true);
      expect(deepEqual(true, 1)).toBe(true);
    });
  });

  describe('7.5', function() {
    it('own properties & keys (not necessarily the same order)', function() {
      expect.assertions(1);
      expect.assertions(1);
      const a1 = [1, 2, 3];
      const a2 = [1, 2, 3];
      a1.a = 'test';
      a1.b = true;
      a2.b = true;
      a2.a = 'test';

      expect(
        deepEqual(
          {a: 4},
          {
            a: 4,
            b: true,
          },
        ),
      ).toBe(false);

      expect(deepEqual(Object.keys(a1), Object.keys(a2))).toBe(false);

      expect(deepEqual({a: 4}, {a: 4})).toBe(true);

      expect(
        deepEqual(
          {
            a: 4,
            b: '2',
          },
          {
            a: 4,
            b: '2',
          },
        ),
      ).toBe(true);

      expect(deepEqual([4], ['4'])).toBe(true);
      expect(deepEqual(['a'], {0: 'a'})).toBe(true);

      expect(
        deepEqual(
          {
            a: 4,
            b: '1',
          },
          {
            b: '1',
            a: 4, // eslint-disable-line sort-keys
          },
        ),
      ).toBe(true);

      expect(deepEqual(a1, a2)).toBe(true);
      a1.d = 1;
      a2.c = 1;
      expect(deepEqual(a1, a2)).toBe(false);
    });
  });

  describe('instances', function() {
    /**
     * Test constructor 1.
     *
     * @private
     * @class
     * @param {string} first - A persons first name.
     * @param {string} last - A persons last name.
     */
    const NameBuilder1 = function(first, last) {
      this.first = first;
      this.last = last;
    };

    NameBuilder1.prototype = {
      /**
       * Get a string representation of the object.
       *
       * @private
       * @returns {string} Full name.
       */
      toString() {
        return `${this.first} ${this.last}`;
      },
    };

    /**
     * Test constructor 2.
     *
     * @private
     * @class
     * @param {string} first - A persons first name.
     * @param {string} last - A persons last name.
     */
    const NameBuilder2 = function(first, last) {
      this.first = first;
      this.last = last;
    };

    NameBuilder2.prototype = Object;

    it('prototype property comparison', function() {
      expect.assertions(1);
      expect.assertions(1);
      let nb1 = new NameBuilder1('John', 'Smith');
      let nb2 = new NameBuilder2('John', 'Smith');
      expect(deepEqual(nb1, nb2)).toBe(true);
      expect(deepEqual('a', {})).toBe(false);

      NameBuilder2.prototype = NameBuilder1.prototype;
      nb1 = new NameBuilder1('John', 'Smith');
      nb2 = new NameBuilder2('John', 'Smith');
      expect(deepEqual(nb1, nb2)).toBe(true);
    });
  });

  describe('eS6 primitives', function() {
    it('compared to similar objects', function() {
      expect.assertions(1);
      expect.assertions(1);
      expect(deepEqual(null, {})).toBe(false);
      expect(deepEqual(undefined, {})).toBe(false);
      expect(deepEqual('a', ['a'])).toBe(false);
      expect(deepEqual('a', {0: 'a'})).toBe(false);
      expect(deepEqual(1, {})).toBe(false);
      expect(deepEqual(true, {})).toBe(false);
    });
  });

  describe('eS6 symbols', function() {
    ifSymbolSupport('compared to similar objects', function() {
      const syma = Symbol('a');
      const symb = Symbol('b');
      expect(deepEqual(syma, syma)).toBe(true);
      expect(deepEqual(syma, symb)).toBe(false);
      expect(deepEqual(syma, {})).toBe(false);
    });
  });

  describe('object wrappers', function() {
    it('when comparing similar objects', function() {
      expect.assertions(1);
      expect.assertions(1);
      expect(deepEqual(Object('a'), ['a'])).toBe(true);
      expect(deepEqual(Object('a'), {0: 'a'})).toBe(true);
      expect(deepEqual(Object(1), {})).toBe(true);
      expect(deepEqual(Object(true), {})).toBe(true);
    });
  });

  describe('buffer', function() {
    ifBufferSupport('comparing two buffers', function() {
      const b1 = bufferFrom([1, 2, 3]);
      const b2 = bufferFrom([1, 2, 3]);
      const b3 = bufferFrom([1, 2]);
      expect(deepEqual(b1, b1)).toBe(true);
      expect(deepEqual(b1, b2)).toBe(true);
      expect(deepEqual(b1, b3)).toBe(false);
    });
  });

  describe('arrayBuffer', function() {
    ifArrayBufferSupport('comparing two array buffers', function() {
      const b1 = new Int32Array([1, 2, 3]);
      const b2 = new Int32Array([1, 2, 3]);
      const b3 = new Int32Array([1, 2]);
      expect(deepEqual(b1, b1)).toBe(true);
      expect(deepEqual(b1, b2)).toBe(true);
      expect(deepEqual(b1, b3)).toBe(false);
    });
  });

  describe('map', function() {
    ifMapSupport('comparing two maps', function() {
      const m1 = new Map();
      const m2 = new Map();
      m1.set(1, 2);
      m1.set(2, 3);
      m2.set(1, 2);
      expect(deepEqual(m1, m1)).toBe(true);
      expect(deepEqual(m1, m2)).toBe(true);
    });
  });

  describe('set', function() {
    ifSetSupport('comparing two set', function() {
      const s1 = new Set();
      const s2 = new Set();
      s1.add(1);
      s1.add(2);
      s2.add(1);
      expect(deepEqual(s1, s1)).toBe(true);
      expect(deepEqual(s1, s2)).toBe(true);
    });
  });

  describe('non circular refs', function() {
    it('make sure stack works', function() {
      expect.assertions(1);
      expect.assertions(1);
      const b = {
        s: '',
        t: true,
        u: undefined,
        v: 1,
        w: null,
      };
      const c = {
        s: '',
        t: true,
        u: undefined,
        v: 1,
        w: null,
      };
      expect(deepEqual(b, c)).toBe(true);
    });
  });

  describe('circular refs', function() {
    it("make sure it doesn't loop forever", function() {
      expect.assertions(1);
      expect.assertions(1);
      const b = {
        s: '',
        t: true,
        u: undefined,
        v: 1,
        w: null,
      };
      const c = {
        s: '',
        t: true,
        u: undefined,
        v: 1,
        w: null,
      };
      let gotError = false;

      b.b = b;
      c.b = c;

      try {
        deepEqual(b, c);
      } catch (e) {
        gotError = true;
        expect(e).toStrictEqual(jasmine.any(RangeError));
        expect(e.message).toBe('Circular object');
      }

      expect(gotError).toBe(true);
    });
  });

  describe('reflexivity', function() {
    it('`arguments` objects', function() {
      expect.assertions(1);
      expect.assertions(1);
      const args = returnArgs();
      expect(deepEqual([], args)).toBe(false);
      expect(deepEqual(args, [])).toBe(false);
    });
  });

  describe('arguments', function() {
    it('comparing same type objects', function() {
      expect.assertions(1);
      expect.assertions(1);
      const args1 = returnArgs(1, 2, 3);
      const args2 = returnArgs(1, 2, 3);
      const args3 = returnArgs(1, 3, 4);
      expect(deepEqual(args1, args1)).toBe(true);
      expect(deepEqual(args1, args2)).toBe(true);
      expect(deepEqual(args1, args3)).toBe(false);
    });
  });

  describe("examples from node's documentation", function() {
    it('prototypes, symbols, or non-enumerable properties', function() {
      expect.assertions(1);
      expect.assertions(1); // WARNING: This does not throw an AssertionError!
      expect(deepEqual(Error('a'), Error('b'))).toBe(true);
    });
  });
});

// strict

describe('deepStrictEqual', function() {
  describe('7.2', function() {
    it('dates', function() {
      expect.assertions(1);
      expect.assertions(1);
      expect(deepEqual(new Date(), new Date(2000, 3, 14), true)).toBe(false);
      expect(deepEqual(new Date(2000, 3, 14), new Date(2000, 3, 14), true)).toBe(true);
    });
  });

  describe('7.3', function() {
    it('regExps', function() {
      expect.assertions(1);
      expect.assertions(1);
      const re1 = /a/;
      re1.lastIndex = 3;

      expect(deepEqual(/ab/, /a/, true)).toBe(false);
      expect(deepEqual(/a/g, /a/, true)).toBe(false);
      expect(deepEqual(/a/i, /a/, true)).toBe(false);
      expect(deepEqual(/a/m, /a/, true)).toBe(false);
      expect(deepEqual(/a/gim, /a/im, true)).toBe(false);
      expect(deepEqual(re1, /a/, true)).toBe(false);

      re1.lastIndex = 0;
      expect(deepEqual(re1, /a/, true)).toBe(true);
      expect(deepEqual(/a/, /a/, true)).toBe(true);
      expect(deepEqual(/a/g, /a/g, true)).toBe(true);
      expect(deepEqual(/a/i, /a/i, true)).toBe(true);
      expect(deepEqual(/a/m, /a/m, true)).toBe(true);
      expect(deepEqual(/a/gim, /a/gim, true)).toBe(true);
    });
  });

  describe('7.4', function() {
    it('`===` equality', function() {
      expect.assertions(1);
      expect.assertions(1);
      expect(deepEqual(4, '5', true)).toBe(false);
      expect(deepEqual(4, '4', true)).toBe(false);
      expect(deepEqual(true, 1, true)).toBe(false);
    });
  });

  describe('7.5', function() {
    it('own properties & keys (not necessarily the same order)', function() {
      expect.assertions(1);
      expect.assertions(1);
      const a1 = [1, 2, 3];
      const a2 = [1, 2, 3];
      a1.a = 'test';
      a1.b = true;
      a2.b = true;
      a2.a = 'test';

      expect(
        deepEqual(
          {a: 4},
          {
            a: 4,
            b: true,
          },
          true,
        ),
      ).toBe(false);

      expect(deepEqual(Object.keys(a1), Object.keys(a2), true)).toBe(false);

      expect(deepEqual({a: 4}, {a: 4}, true)).toBe(true);

      expect(deepEqual({a: 4}, {a: '4'}, true)).toBe(false);

      expect(
        deepEqual(
          {
            a: 4,
            b: '2',
          },
          {
            a: 4,
            b: '2',
          },
          true,
        ),
      ).toBe(true);

      expect(deepEqual([4], ['4'], true)).toBe(false);
      expect(deepEqual(['a'], {0: 'a'}, true)).toBe(false);

      expect(
        deepEqual(
          {
            a: 4,
            b: '1',
          },
          {
            b: '1',
            a: 4, // eslint-disable-line sort-keys
          },
          true,
        ),
      ).toBe(true);

      expect(deepEqual(a1, a2, true)).toBe(true);
      a1.d = 1;
      a2.c = 1;
      expect(deepEqual(a1, a2)).toBe(false);
    });
  });

  describe('instances', function() {
    /**
     * Test constructor 1.
     *
     * @private
     * @class
     * @param {string} first - A persons first name.
     * @param {string} last - A persons last name.
     */
    const NameBuilder1 = function(first, last) {
      this.first = first;
      this.last = last;
    };

    NameBuilder1.prototype = {
      /**
       * Get a string representation of the object.
       *
       * @private
       * @returns {string} Full name.
       */
      toString() {
        return `${this.first} ${this.last}`;
      },
    };

    /**
     * Test constructor 2.
     *
     * @private
     * @class
     * @param {string} first - A persons first name.
     * @param {string} last - A persons last name.
     */
    const NameBuilder2 = function(first, last) {
      this.first = first;
      this.last = last;
    };

    NameBuilder2.prototype = Object;

    it('prototype property comparison', function() {
      expect.assertions(1);
      expect.assertions(1);
      let nb1 = new NameBuilder1('John', 'Smith');
      let nb2 = new NameBuilder2('John', 'Smith');
      expect(deepEqual(nb1, nb2, true)).toBe(false);
      expect(deepEqual('a', {}, true)).toBe(false);

      NameBuilder2.prototype = NameBuilder1.prototype;
      nb1 = new NameBuilder1('John', 'Smith');
      nb2 = new NameBuilder2('John', 'Smith');
      expect(deepEqual(nb1, nb2, true)).toBe(true);
    });
  });

  describe('eS6 primitives', function() {
    it('compared to similar objects', function() {
      expect.assertions(1);
      expect.assertions(1);
      expect(deepEqual(null, {}, true)).toBe(false);
      expect(deepEqual(undefined, {}, true)).toBe(false);
      expect(deepEqual('a', ['a'], true)).toBe(false);
      expect(deepEqual('a', {0: 'a'}, true)).toBe(false);
      expect(deepEqual(1, {}, true)).toBe(false);
      expect(deepEqual(true, {}, true)).toBe(false);
    });
  });

  describe('eS6 symbols', function() {
    ifSymbolSupport('compared to similar objects', function() {
      const syma = Symbol('a');
      const symb = Symbol('b');
      expect(deepEqual(syma, syma, true)).toBe(true);
      expect(deepEqual(syma, symb, true)).toBe(false);
      expect(deepEqual(syma, {}, true)).toBe(false);
    });
  });

  describe('object wrappers', function() {
    it('when comparing similar objects', function() {
      expect.assertions(1);
      expect.assertions(1);
      expect(deepEqual(Object('a'), ['a'], true)).toBe(false);
      expect(deepEqual(Object('a'), {0: 'a'}, true)).toBe(false);
      expect(deepEqual(Object(1), {}, true)).toBe(false);
      expect(deepEqual(Object(true), {}, true)).toBe(false);
    });
  });

  describe('non circular refs', function() {
    it('make sure stack works', function() {
      expect.assertions(1);
      expect.assertions(1);
      const b = {
        s: '',
        t: true,
        u: undefined,
        v: 1,
        w: null,
      };
      const c = {
        s: '',
        t: true,
        u: undefined,
        v: 1,
        w: null,
      };
      expect(deepEqual(b, c, true)).toBe(true);
    });
  });

  describe('circular refs', function() {
    it("make sure it doesn't loop forever", function() {
      expect.assertions(1);
      expect.assertions(1);
      const b = {
        s: '',
        t: true,
        u: undefined,
        v: 1,
        w: null,
      };
      const c = {
        s: '',
        t: true,
        u: undefined,
        v: 1,
        w: null,
      };
      let gotError = false;

      b.b = b;
      c.b = c;

      try {
        deepEqual(b, c, true);
      } catch (e) {
        gotError = true;
        expect(e).toStrictEqual(jasmine.any(RangeError));
        expect(e.message).toBe('Circular object');
      }

      expect(gotError).toBe(true);
    });
  });

  describe('buffer', function() {
    ifBufferSupport('comparing two buffers', function() {
      const b1 = bufferFrom([1, 2, 3]);
      const b2 = bufferFrom([1, 2, 3]);
      const b3 = bufferFrom([1, 2]);
      expect(deepEqual(b1, b1, true)).toBe(true);
      expect(deepEqual(b1, b2, true)).toBe(true);
      expect(deepEqual(b1, b3, true)).toBe(false);
    });
  });

  describe('arrayBuffer', function() {
    ifArrayBufferSupport('comparing two array buffers', function() {
      const b1 = new Int32Array([1, 2, 3]);
      const b2 = new Int32Array([1, 2, 3]);
      const b3 = new Int32Array([1, 2]);
      expect(deepEqual(b1, b1, true)).toBe(true);
      expect(deepEqual(b1, b2, true)).toBe(true);
      expect(deepEqual(b1, b3, true)).toBe(false);
    });
  });

  describe('map', function() {
    ifMapSupport('comparing two maps', function() {
      const m1 = new Map();
      const m2 = new Map();
      m1.set(1, 2);
      m1.set(2, 3);
      m2.set(1, 2);
      expect(deepEqual(m1, m1, true)).toBe(true);
      expect(deepEqual(m1, m2, true)).toBe(true);
    });
  });

  describe('set', function() {
    ifSetSupport('comparing two set', function() {
      const s1 = new Set();
      const s2 = new Set();
      s1.add(1);
      s1.add(2);
      s2.add(1);
      expect(deepEqual(s1, s1, true)).toBe(true);
      expect(deepEqual(s1, s2, true)).toBe(true);
    });
  });

  describe('reflexivity', function() {
    it('`arguments` objects', function() {
      expect.assertions(1);
      expect.assertions(1);
      const args = returnArgs();
      expect(deepEqual([], args), true).toBe(false);
      expect(deepEqual(args, []), true).toBe(false);
    });
  });

  describe('arguments', function() {
    it('comparing same type objects', function() {
      expect.assertions(1);
      expect.assertions(1);
      const args1 = returnArgs(1, 2, 3);
      const args2 = returnArgs(1, 2, 3);
      const args3 = returnArgs(1, 3, 4);
      expect(deepEqual(args1, args1)).toBe(true);
      expect(deepEqual(args1, args2)).toBe(true);
      expect(deepEqual(args1, args3)).toBe(false);
    });
  });

  describe('examples from documentation', function() {
    it('prototypes, symbols, or non-enumerable properties', function() {
      expect.assertions(1);
      expect.assertions(1); // WARNING: This does not throw an AssertionError!
      expect(deepEqual(Error('a'), Error('b'), true)).toBe(true);
    });
  });
});
