## let 和 const 命令

### let 命令

let 所声明的变量，只在let命令所在的代码块内有效。

for循环的计数器，就很合适使用let命令。

```
for (let i = 0; i < 10; i++) {}

console.log(i);
//ReferenceError: i is not defined
```

#### 不存在变量提升

```
console.log(foo); // 输出undefined
console.log(bar); // 报错ReferenceError

var foo = 2;
let bar = 2;
```

#### 暂时性死区

只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

```
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```

ES6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

#### 不允许重复声明

```
// 报错
function () {
  let a = 10;
  var a = 1;
}

// 不能在函数内部重新声明参数
function func(arg) {
  let arg; // 报错
}
```

### 块级作用域

let实际上为JavaScript新增了块级作用域

```
function f1() {
  let n = 5;
  if (true) {
    let n = 10;
  }
  console.log(n); // 5
}
```
* ES6允许块级作用域的任意嵌套
* 外层作用域无法读取内层作用域的变量
* 内层作用域可以定义外层作用域的同名变量

#### 块级作用域与函数声明

* 允许在块级作用域内声明函数。
* 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
* 函数声明还会提升到所在的块级作用域的头部。

上面三条规则只对ES6的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作let处理。

### const

const声明一个只读的常量。一旦声明，常量的值就不能改变。

* const一旦声明变量，就必须立即初始化，不能留到以后赋值
* 只在声明所在的块级作用域内有效
* const命令声明的常量也是不提升，同样存在暂时性死区
* const声明的常量，也与let一样不可重复声明

ES6一共有6种声明变量的方法。

* var
* function
* let
* const
* import
* class

### 顶层对象的属性

ES6为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。

```
var a = 1;
// 如果在Node的REPL环境，可以写成global.a
// 或者采用通用方法，写成this.a
window.a // 1

let b = 1;
window.b // undefined
```

### 顶层对象

ES5的顶层对象，本身也是一个问题。

* 浏览器里面，顶层对象是window，但Node和Web Worker没有window。
* 浏览器和Web Worker里面，self也指向顶层对象，但是Node没有self。
* Node里面，顶层对象是global，但其他环境都不支持。

为了能够在各种环境，都能取到顶层对象，现在一般是使用this变量。

* 全局环境中，this会返回顶层对象。但是，Node模块和ES6模块中，this返回的是当前模块
* 函数里面的this，如果函数不是作为对象的方法运行，而是单纯作为函数运行，this会指向顶层对象。但是，严格模式下，这时this会返回undefined
* 不管是严格模式，还是普通模式，new Function('return this')()，总是会返回全局对象。但是，如果浏览器用了CSP（Content Security Policy，内容安全政策），那么eval、new Function这些方法都可能无法使用

```
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```

垫片库system.global模拟了这个提案，可以在所有环境拿到global。

```
// CommonJS的写法
var global = require('system.global')();

// ES6模块的写法
import getGlobal from 'system.global';
const global = getGlobal();
```

### 原文链接

[let和const命令](http://es6.ruanyifeng.com/#docs/let)