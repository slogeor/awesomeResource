## Generator 函数

### 1. 简介

#### 基本概念

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。

从语法上可以理解成 Generator 函数是一个状态机，封装了多个内部状态。

执行 Generator 函数会返回一个遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

形式上，Generator 函数有两个特征。一是 function 关键字和函数名之间有一个星号(*)，二是函数体内部使用 yield 语句，定义不同的内部状态。

```
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
  yield 'hahaha';
}

var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

Generator 函数的调用方法和普通函数一样，不同的是调用 Generator 函数后，函数并不会执行，返回的也不是函数运行结果，而是一个指向内部状态的指针，也就是遍历器对象。

必须调用遍历器对象的 next 方法，使得指针移向下一个状态。每次调用 next 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield语句(或return语句)为止。换言之，Generator 函数式分段执行的，yield 语句是暂停执行的标记，而 next 方法可以恢复执行。

next 方法返回一个对象，它的 value 属性就是当前 yield 语句的值，done 属性的值表示遍历是否结束。

调用 Generator 函数，返回一个遍历对象，代表 Generator 函数的内部指针，每次调用遍历器对象的 next 方法，就会返回一个有着 value 和 done 两个属性的对象。 value 属性表示当前的内部状态值，是 yield 语句后面那个表达式的值；done 属性是一个布尔值，表示是否遍历结束。

#### yield 语句

yield 语句就是暂停标志，遍历器对象的 next 方法的运行逻辑如下。

1. 遇到 yield 语句，就暂停执行后面的操作，并将紧跟 yield 后面的表达式的值，作为返回对象的 value 属性值
2. 下一次调用 next 方法，会继续往下执行，直到遇到下一个 yield 语句
3. 如果没有遇到新的 yield 语句，会一直运行到函数结束，直到 return 语句为止，并将 return 语句后面跟着的表达式的值，作为返回对象的 value 属性值
4. 如果没有 return 语句，则返回对象的value 为 undefined

yield 语句后面的表达式，只有调用 next 方法、内部指针指向该语句时才会执行(惰性求值)。

- yield 语句不能放在普通函数中，否则会报错。
- yield 语句如果在一个表达式中，必须放在圆括号里面

```
console.log('Hello' + yield); // SyntaxError
console.log('Hello' + yield 123); // SyntaxError

console.log('Hello' + (yield)); // OK
console.log('Hello' + (yield 123)); // OK
```
- yield 语句用作函数参数或赋值表达式的右边，可以不加括号

```
foo(yield 'a', yield 'b'); // OK
let input = yield; // OK
``` 

#### 与 Iterator 接口的关系

任意一个对象的 Symbol.iterator 方法等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。

通过将 Generator 函数赋值给 Symbol.iterator 属性，从而使得该对象具有 Iterator 接口。

```
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```

Generator 函数执行后，返回一个可遍历对象，该对象本身具有 Symbol.iterator 属性，执行后返回自身。

```
function* gen(){
  // some code
}

var g = gen();

g[Symbol.iterator]() === g
// true
```

### 2. next 方法的参数

yield 句本身没有返回值，或者说总是返回 undefined。next 方法可以带一个参数，该参数就会被当做上一个 yield 语句的返回值。

```
function* f() {
  for(var i=0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
g.next() // { value: 0, done: false }
```

如果 next 方法没有参数，每次运行到 yield 语句，变量 reset 的值总是 undefined。当 next 方法带一个参数 true 时，当前的变量 reset 被重置为 true，因此 i 等于 -1，下一轮循环 i 从 -1 开始。

Generator 函数从暂停状态到恢复运行，它的上下文状态是不变的，通过 next 方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值。可以理解为，在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

```
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```
next 方法的参数表示上一个 yield 语句的返回值，所以第一次调用 next 方法时，不能带有参数，v8 引擎会直接忽略第一次使用 next 方法的参数，只有从第二次使用 next 方法开始，参数才是有效的。

```
function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  return 'result';
}

let genObj = dataConsumer();
genObj.next();
// Started
genObj.next('a')
// 1. a
genObj.next('b')
// 2. b
```

### 3. for...of 循环

for...of 循环可以自动遍历 Generator 函数生成的 Iterator 对象，不需要调用 next 方法。

```
function *foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

for...of 循环遇到 next 方法返回对象的 done 属性为 true，循环就会结束，所以循环只输出 5 个 yield 语句的值。


利用 for...of 循环，可以写出遍历任意的对象的方法。原生的 JavaScript 对象没有遍接口，无法使用 for...of 循环，但是可以借助 Generator 函数为它加上这个接口。

**方案1**

```
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe

```

**方案二**

```
function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

### 4. Generator.prototype.throw()

Generator 函数返回的遍历器对象，都有一个 throw 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

```
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

遍历器对象 i 连续抛出两个错误，第一个错误被 Generator 函数体内的 catch 语句捕获。i 第二次抛出错误，由于 Generator 函数内部的 catch 已经执行过，不会再捕捉这个错误，所有被外部的 catch 捕获。

throw 方法可以接受一个参数，该参数会被 catch 语句接受，建议抛出 Error 对象的实例。

如果Generator函数内部没有部署try...catch代码块，那么throw方法抛出的错误，将被外部try...catch代码块捕获。

throw方法被捕获以后，会附带执行下一条yield语句。也就是说，会附带执行一次next方法。

一旦 Generator 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去。

### 5. Generator.prototype.return()

Generator 函数返回的遍历器对象，有一个 return  方法，可以返回给定的值，并且终结遍历 Generator 函数。

```
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

遍历器对象 g 调用 return 方法后，可以返回值的 value 属性就是 return 方法的参数 foo，并且 Generator 函数的遍历就终止了，返回值得 done 属性为 ture。

如果 return 方法调用时，不提供参数，则返回值得 value 属性为 undefined。

如果 Generator 函数内部有 try...finally 代码块，那么 return 方法会推迟到 finally 代码块执行完再执行。

```
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers()
g.next() // { done: false, value: 1 }
g.next() // { done: false, value: 2 }
g.return(7) // { done: false, value: 4 }
g.next() // { done: false, value: 5 }
g.next() // { done: true, value: 7 }
```

### 6. yield* 语句

如果在 Generator 函数内部调用另一个 Generator 函数，默认情况下是没有任何效果的。

```
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  foo();
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "y"
```

yield* 语句用来在一个 Generator 函数里执行另一个 Generator 函数。

```
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
```

从语法角度看，如果yield 命令后面跟的是一个遍历器对象，需要在 yield 命令后面加上星号，表明它返回的是一个遍历器对象，这被称为 yield* 语句。


yield * 后面的 Generator 函数(没有 return 语句时)，不过是 for...of 的一种简写形式，完全可以用 for...of 替代。

如果被代理的 Generator 函数有 return 语句，那么就可以向代理它的 Generator 函数返回数据。

```
function *foo() {
  yield 2;
  yield 3;
  return "foo";
}

function *bar() {
  yield 1;
  var v = yield *foo();
  console.log( "v: " + v );
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```
### 7. 作为对象属性的 Generator 函数

```
let obj = {
  * myGeneratorMethod() {
    ···
  }
};

// 等价于
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```
### Generator 函数的 this

Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的 prototype 对象上的方法。

```
function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello() // 'hi!'
```
Generator 函数 g 在 this 对象上添加一个属性 a，但是 obj 对象拿不到这个属性.

```
function* g() {
  this.a = 11;
}

let obj = g();
obj.a // undefined
```

Generator 函数也不能跟 new 命令一起用，会报错。

```
function* F() {
  yield this.x = 2;
  yield this.y = 3;
}

new F()
// TypeError: F is not a constructor
```

变通方法: 首先生成一个空对象，使用 bind 方法绑定 Generator 函数内部的 this，这样构造函数调用后，这个空对象就是 Generator 函数的实例对象。

```
function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

function F() {
  return gen.call(gen.prototype);
}

var f = new F();

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3

```

### 9. 应用

- 异步操作的同步化表达
- 控制流管理
- 部署 Iterator 接口
- 作为数据结构

### 原文链接
[http://es6.ruanyifeng.com/#docs/generator](http://es6.ruanyifeng.com/#docs/generator)


