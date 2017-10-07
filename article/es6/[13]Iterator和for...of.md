## Iterator和for...of循环

### 1. Iterator 的概念

Iterator 是这样一种机制，它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。

Iterator 的作用用三个，一是为各种数据结构提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某次序排列；三是 ES6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要提供 for...of。

Iterator 的遍历过程

(1) 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上是一个指针对象
(2) 第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员
(3) 第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员
(4) 不断调用指针对象的 next 方法，直到它指向数据的结束位置

每一次调用 next 方法，都会返回数据结构的当前成员信息(对象)，包含 value 和 done，其中 value 属性是当前成员的值，done 属性是一个布尔值，表示遍历是否结束。

### 2. 数据结构的默认 Iterator 接口

Iterator 接口的目的，就是为了给所有数据结构，提供一种统一的访问机制，即 for...of循环。

ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性，或者说一个数据结构只要具有 Symbol.iterator 属性，就可以认为是可遍历的。

在 ES6 中，有三类数据结构原生具备 Iterator 接口: 数组、某些类数组的对象、Set 和 Map。

```
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

原生就部署 Iterator 接口的数据结构，不用自己写遍历器生成函数，for...of 循环会自动遍历它们。除此之外，其他数据结构的 Iterator 接口，都需要自己在 Symbol.iterator 属性上部署，这样才会被 for...of 循环遍历。

```
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    } else {
      return {done: true, value: undefined};
    }
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value);
}
```

对于类似数组的对象(存在数值键名和length属性)，部署 Iterator 接口，有一个简便方法，就是 Symbol.iterator 方法直接引用数组的 Iterator 接口

```
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];

[...document.querySelectorAll('div')] 
```

类似数组的对象调用数组的 Symbol.iterator 方法的例子

```
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```

### 3. 调用 Iterator 接口的场合

#### (1) 解构赋值

对数组和Set结构进行解构赋值时，会默认调用 Symbol.iterator 方法。

```
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```
#### (2) 扩展运算符

扩展运算符(...)会调用默认的 Iterator 接口

```
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

实际上，这提供了一种简便机制，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符将其转换成数组。

```
let arr = [...iterable];
```

#### (3) yield*

yield* 后面跟的是一个可遍历的结构，会调用该结构的遍历器接口。

```
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```
#### (4) 其他场合

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。

- for...of
- Array.from()
- Map()、Set()、WeakMap()、WeakSet()
- Promise.all()
- Promise.race()

### 4. 字符串的 Iterator 接口

字符串是一个类似数组的对象，也原生具有 Iterator 接口。

```
var someString = "hi";
typeof someString[Symbol.iterator]
// "function"

var iterator = someString[Symbol.iterator]();

iterator.next()  // { value: "h", done: false }
iterator.next()  // { value: "i", done: false }
iterator.next()  // { value: undefined, done: true }
```

### 5. Iterator 接口和 Generator 函数

Symbol.Iterator 方法的最简单实现，还是要使用 Generator 函数

```
var obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
```
Symbol.iterator 方法几乎不用部署任何代码，只要用 yield 命令给出每一步的返回值即可。

### 6. 遍历器对象的 return()、throw()

遍历器对象除了具有 next() 方法，还可以具有 return 方法和 throw 方法。如果自己写遍历器对象生成函数，next 方法是必须部署的。 return 和 throw 方法是可选的。

return 方法的使用场合是: 如果 for...of 循环提前退出，可以调用 return 方法。如果一个对象在完成遍历前，需要清理或释放资源，也可以部署 return 方法。

需要注意的是 return 方法必须返回一个对象，这是 Generator 规格决定的。

### 7. for...of 循环

一个数据结构只要部署了 Symbol.iterator 属性，就视为具有 iterator 接口，就可以用 for...of 循环遍历它的成员，也就是说，for...of 循环内部调用的是数据结构的 Symbol.iterator 方法。

for...of 循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象(arguments对象、DOM NodeList 对象)、Generator 对象，以及字符串。

#### 数组

数组原生具备 iterator 接口，for...of 循环本质上就是调用这个接口生成的遍历器。

```
const arr = ['red', 'green', 'blue'];
let iterator  = arr[Symbol.iterator]();

for(let v of arr) {
  console.log(v); // red green blue
}

for(let v of iterator) {
  console.log(v); // red green blue
}
```

for...of 循环读取键值，for...in 循环读取键名。for...of 循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。

```
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}

console.log(arr); // [3, 5, 7]
```

### Set 和 Map 结构

Set 和 Map 结构原生具有 Iterator 接口，可以直接使用 for...of 循环。

```
var engines = new Set(["Gecko", "Trident", "Webkit", "Webkit"]);
for (var e of engines) {
  console.log(e);
}
// Gecko
// Trident
// Webkit

let map = new Map().set('a', 1).set('b', 2);
for (let pair of map) {
  console.log(pair);
}
// ['a', 1]
// ['b', 2]

for (let [key, value] of map) {
  console.log(key + ' : ' + value);
}
// a : 1
// b : 2
```

值得注意的地方有两个，首先，遍历的顺序是按照各个成员被添加进数据结构的顺序。其次，Set 结构遍历时，返回的是一个值，而 Map 结构遍历时，返回的是一个数组，该数组的两个成员分别为当前 Map 成员的键名和键值。

#### 计算生成的数据结构

有些数据结构是在现有的数据结构的基础上，计算生成的。

- entries() 用来遍历[键名, 键值]组成的数组
- keys() 用来遍历所有的键名
- values() 用来遍历所有的键值

#### 类似数组的对象

类似数组的对象包括 字符串、DOM NodeList、arguments。

对于字符串来说，for...of 循环还有一个特点，可以正确识别 32 位 UTF-16 字符。

并不是所有类似数组的对象都具有 iterator 接口，需要通过 Array.from 方法将其转换成数组。

```
let arrayLike = { length: 2, 0: 'a', 1: 'b' };

// 报错
for (let x of arrayLike) {
  console.log(x);
}

// 正确
for (let x of Array.from(arrayLike)) {
  console.log(x);
}
```

#### 对象

对于普通对象，for...of 结构不能直接使用，需要部署 iterator 接口后才能使用。

方法1: 使用 Object.keys 方法将对象的键名生成一个数组。

```
for (var key of Object.keys(someObject)) {
  console.log(key + ": " + someObject[key]);
}
```

方法2: 将数组的 Symbol.iterator 属性直接赋值给对象的 Symbol.iterator 属性。

```
jQuery.prototype[Symbol.iterator] =  Array.prototype[Symbol.iterator];
```

方法3: 使用 Generator 函数将对象重新包装一下

```
function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

for (let [key, value] of entries(obj)) {
  console.log(key, "->", value);
}
```

#### 与其他遍历语法的比较

- for 循环，写法比较麻烦
- forEach 无法中途跳出 forEach 循环，break 和 return 都不生效
- for...in  主要是为遍历对象而设计的，会以任意顺序遍历，会遍历手动添加的属性，甚至包括原型链的键

for...of 循环的优点

- 有着同 for...in 一样的简洁语法，没有 for...in 的缺点
- 可以与 break、continue、return 配合使用
- 提供了遍历所有数据结构统一操作接口

### 原文链接

[http://es6.ruanyifeng.com/#docs/iterator](http://es6.ruanyifeng.com/#docs/iterator)

