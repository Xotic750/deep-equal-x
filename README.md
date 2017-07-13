<a href="https://travis-ci.org/Xotic750/deep-equal-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/deep-equal-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/deep-equal-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/deep-equal-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/deep-equal-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/deep-equal-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/deep-equal-x" title="npm version">
<img src="https://badge.fury.io/js/deep-equal-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_deep-equal-x"></a>

## deep-equal-x
node's deepEqual and deepStrictEqual algorithm.

**Version**: 1.7.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
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

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>\*</code> | First comparison object. |
| expected | <code>\*</code> | Second comparison object. |
| [strict] | <code>boolean</code> | Comparison mode. If set to `true` use `===`. |

**Example**  
```js
var deepEqual = require('deep-equal-x');

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
