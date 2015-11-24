<a name="module_deep-equal-x"></a>
## deep-equal-x
[deep-equal-x](http://xotic750.github.io/deep-equal-x)
node's deepEqual algorithm.
[![Build Status]
(https://travis-ci.org/Xotic750/deep-equal-x.svg?branch=master)]
(https://travis-ci.org/Xotic750/deep-equal-x)
[![Dependency Status](https://david-dm.org/Xotic750/deep-equal-x.svg)]
(https://david-dm.org/Xotic750/deep-equal-x)
[![devDependency Status]
(https://david-dm.org/Xotic750/deep-equal-x/dev-status.svg)]
(https://david-dm.org/Xotic750/deep-equal-x#info=devDependencies)
[![npm version](https://badge.fury.io/js/deep-equal-x.svg)]
(https://badge.fury.io/js/deep-equal-x)

**Version**: 1.0.3  
**Author:** Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_deep-equal-x--module.exports"></a>
### `module.exports(actual, expected, [strict])` ⇒ <code>boolean</code> ⏏
Tests for deep equality. Primitive values are compared with the equal
comparison operator ( == ). This only considers enumerable properties.
It does not test object prototypes, attached symbols, or non-enumerable
properties. This can lead to some potentially surprising results. If
`strict` is `true` then Primitive values are compared with the strict
equal comparison operator ( === ).

**Kind**: Exported function  
**Returns**: <code>boolean</code> - `true` if `actual` and `expected` are deemed equal,
 otherwise `false`.  
**See**: https://nodejs.org/api/assert.html  
**Example**  
```js
deepEqual(Error('a'), Error('b'));
// => true
// This does not return `false` because the properties on the  Error object
// are non-enumerable:

deepEqual(4, '4');
// => true

deepEqual({ a: 4, b: '1' }, {  b: '1', a: 4 });
// => true

deepEqual(new Date(), new Date(2000, 3, 14));
// => false

deepEqual(4, '4', true);
// => false
```
