<a name="module_deep-equal-x"></a>
## deep-equal-x
<a href="https://travis-ci.org/Xotic750/deep-equal-x">
<img src="https://travis-ci.org/Xotic750/deep-equal-x.svg?branch=master"
title="Travis status" alt="Travis status" height="18">
</a>
<a href="https://david-dm.org/Xotic750/deep-equal-x">
<img src="https://david-dm.org/Xotic750/deep-equal-x.svg"
title="Dependency status" alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/deep-equal-x#info=devDependencies">
<img src="https://david-dm.org/Xotic750/deep-equal-x/dev-status.svg"
title="devDependency status" alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/deep-equal-x">
<img src="https://badge.fury.io/js/deep-equal-x.svg"
title="npm version" alt="npm version" height="18">
</a>

node's deepEqual algorithm.

**Version**: 1.0.5  
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
