<a name="module_deep-equal-x"></a>
## deep-equal-x
[deep-equal-x](http://xotic750.github.io/deep-equal-x/)
node's deepEqual algorithm.

**Version**: 1.0.3  
**Author:** Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_deep-equal-x--module.exports"></a>
### module.exports(actual, expected, [strict]) ⇒ <code>boolean</code> ⏏
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
| [strict] | <code>boolean</code> | Comparison mode. |

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
