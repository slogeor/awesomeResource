## Set 和 Map

### 1. Set

#### 基本用法

ES6 提供了新的数据结构 Set，类似于数组，但是成员的值都是唯一的。

```
// 例一
var set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// 例二
var items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

// 例三
function divs () {
  return [...document.querySelectorAll('div')];
}

var set = new Set(divs());
set.size // 56

// 类似于
divs().forEach(div => set.add(div));
set.size // 56
```

向 Set 加入值得时候，不会发生类型转换，所以 5 和 '5' 是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做 "Same-value-equality"，它类似于精确相等运算符(===)，主要区别是 NaN 等于自身，而精确相等运算符认为 NaN 不等于自身。另外两个对象总是不相等。

#### Set 实例的是属性和方法

**Set 结构的实例主要有以下属性**

- Set.prototype.constructor: 构造函数，默认是 Set 函数
- Set.prototype.size: 返回 Set 实例的成员总数

**Set 实例的操作方法**

- add(value): 添加某个值，返回 Set 结构本身
- delete(value): 删除某个值，返回一个布尔值，表示删除是否成功
- has(value): 返回一个布尔值，表示该值是否为 Set 的成员
- clear(): 清除所有成员，没有返回值

Array.from 方法可以将 Set 结构转为数组。

```
var items = new Set([1, 2, 3, 4, 5]);
var array = Array.from(items);
// [1, 2, 3, 4, 5]
```

**遍历操作**

- keys(): 返回键名的遍历器
- values(): 返回键值得遍历器
- entries(): 返回键值对的遍历器
- forEach(): 使用回调函数遍历每个成员

需要特别指出的，Set 的遍历顺序就是插入顺序。比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。

(1) keys()、value()、entries()

```
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的 values 方法。

```
Set.prototype[Symbol.iterator] === Set.prototype.values
// true
Set.prototype.keys === Set.prototype.values
// true
```
(2) forEach

Set 结构的实例的 forEach 方法，用于对每个成员执行某种操作，没有返回值

```
let set = new Set([1, 2, 3]);
set.forEach((value, key) => console.log(value * 2) )
// 2
// 4
// 6
```

(3) 遍历的应用

扩展运算符 (...) 内部实现 for...of 循环，所以可以用于 Set 结构。

```
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
// ['red', 'green', 'blue']
```

数组的 map 和 filter 方法也可以用于 Set。

```
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}
```

### 2. WeakSet

WeakSet 结构与 Set 类似，也是不重复值得集合。但是，它与 Set 有两个区别。

首先，WeakSet 的成员只能是对象，而不能是其他类型的值。

其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用。也就是说，如果其他对象都不在引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。这个特点意味着，无法应用 WeakSet 成员，因此WeakSet 是不可遍历的。

作为构造函数，WeakSet 可以接受一个数组或类数组的对象作为参数，但必须满足数组的成员必须是对象。实际上，任何具有 iterable 接口的对象，都可以作为 WeakSet 的参数。

```
var a = [[1,2], [3,4]];
var ws = new WeakSet(a);

var b = [3, 4];
var ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(…)
```
**WeakSet 结构的三个方法**

- WeakSet.prototype.add(value)
- WeakSet.prototype.delete(value)
- WeakSet.prototype.has(value)

```
var ws = new WeakSet();
var obj = {};
var foo = {};

ws.add(window);
ws.add(obj);

ws.has(window); // true
ws.has(foo);    // false

ws.delete(window);
ws.has(window);    // false
```

WeakSet 不能遍历，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在。WeakSet 的一个用处，是存储 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

### 3. Map

#### 基本用法

ES6 提供了 Map 数据结构，类似于对象，也是键值对的集合，但是键的范围不限于字符串，各种类似的值(包括对象)都可以当做键。也就是说 Object 结构提供的是 字符串-值得对应，而 Map 结构提供了值-值得对应，是一种更完善的 Hash 结构。

只有对同一个对象的引用，Map 结构才将其视为同一个键。

```
var map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```

同样的值的两个实例，在Map结构中被视为两个键。

```
var map = new Map();

var k1 = ['a'];
var k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222
```

Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键值。这就解决了同名属性碰撞的问题。

#### 实例属性和操作方法

**size 属性**

size 属性返回 Map 结构的成员总数

**set(key, value)**

设置 key 所对应的键值，返回整个 Map 结构

**get(key)**

读取 key 对应的键值，如果找不到 key，返回 unfinished

**has(key)**

返回一个布尔值，表示某个键是否在Map数据结构中

**delete(key)**

删除某个键值，成功返回true，失败返回 false

**clear()**

清空所有的成员，没有返回值

#### 遍历方法

- keys(): 返回键名的遍历器
- values(): 返回键值的遍历器
- entries(): 返回所有成员的遍历器
- keys(): 返回Map的所有成员

Map 的遍历顺序就是插入顺序。

Map 结构转化数组结构，比较快速的方法是结合使用扩展运算符(...)

```
let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```

### 4. WeakMap

WeakMap 结构与 Map 结构基本类似，唯一的区别是它只接受对象作为键名(null 除外)，不接受其他类型的值作为键名。而且键名所指向的对象，不计入垃圾回收机制。

WeakMap 的设计目的在于，键名是对象的弱引用(垃圾回收机制不将该引用考虑在内)，所以其对应的对象可能会被自动回收。当对象回收后，WeakMap 自动移除对应的键值对。

基本上 WeakMap 的专用场景就是它的键对所对应的对象，可能会在将来消失，WeakMap 结果有助于防止内存泄漏。

WeakMap 与 Map 在 API 上的区别主要有两个。一是没有遍历操作，也没有 size 属性。二是无法清空，即不支持 clean 方法。因为 WeakMap 只有四个方法: get()、set()、has()、delete()。

WeakMap 的另一个用处是部署私有属性，私有属性是对象实例的若引用，如果删除实例后，它们也会随之消失，不会造成内存泄漏。


### 原文链接

[http://es6.ruanyifeng.com/#docs/set-map](http://es6.ruanyifeng.com/#docs/set-map)