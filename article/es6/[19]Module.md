## Module

ES6 的 Class 只是面向对象编程的语法糖，升级了 ES5 的构造函数的原型链继承的写法，并没有解决模块化问题。Module 功能就是为了解决这个问题而提出的。

ES6 模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西，比如，CommonJS 模块就是对象，输入时必须查找对象属性。

```
// CommonJS模块
let { stat, exists, readFile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat, exists = _fs.exists, readfile = _fs.readfile;
```

上面代码的实质是整体加载 fs 模块，生成一个对象(_fs)，然后从这个对象上读取 3 个方法。这种加载称为运行时加载，因为只能在运行时才能得到这个对象，导致完全没有办法在编译时做静态化。

ES6 模式不是对象，而是通过 export 命令显示指定输出的代码，输入时也采用静态命令的形似。

```
// ES6模块
import { stat, exists, readFile } from 'fs';
```

这段代码实质是从 fs 模块加载 3 个方法，其他方法不加载。这种加载被称为编译时加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致没法引用 ES6 模块本身，因为它不是对象。

除了静态加载带来的好处，ES6 模块还有以下其他好处。

- 不再需要 UMD 模块格式。将来服务器和浏览器都会支持 ES6 模块
- 将来浏览器的新 API 就能用模块格式提供，不再必要做成全局变量或 navigator 对象的属性
- 不再需要对象作为命名空间，未来这些功能可以通过模块提供

### 1. 严格模式

ES6 的模块自动采用严格模式，不管是否在模块头添加 use strict。

严格模式主要有以下限制。

- 变量必须声明后在使用
- 函数的参数不能有同名属性，否则会报错
- 不能使用 with 语句
- 不能对只读属性赋值，否则会报错
- 不能使用前缀 0 表示八进制，否则会报错
- 不能删除不可删除的属性
- 不能删除变量，只能删除属性
- eval 不会在它的外层作用域引入变量
- eval 和 arguments 不能被重新赋值
- arguments 不会自动反映函数参数的变化
- 不能使用 arguments.caller、arguments.callee
- 禁止 this 指向全局对象
- 不能使用 fn.caller 和 fn.arguments 获取函数调用的堆栈
- 增加了保留字

### 2. export 命令

模块功能主要由两个命令构成，export 和 import。export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供的功能。

export 输出的变量就是本来的名字，但是可以使用 as 关键字重命名。

```
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

export 命令规定的是对外的接口，必须与模块内部的变量建立一一对应该关系。

export 命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错。

### import

```
import {firstName, lastName, year} from './profile';
```

import 命令接受一个对象，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块对外接口的名称相同。

import 命名可以使用 as 关键字，将要输入的遍历重命名。

```
import { lastName as surname } from './profile';
```

import 命令具有提升效果，会提升到整个模块的头部，先执行。

import 语句会执行加载的模块。

### 4. 模块的整体加载

可以通过星号(*)指定一个对象，所有输出值都加载在这个对象上面。

```
// circle.js

export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}

// main.js
import * as circle from './circle';

console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```

### 5. export default 命令

为了给用户提供方便，让他们不用阅读文档就能加载模块，可以使用 export default 命令，为模块指定默认输出。

```
// export-default.js
export default function () {
  console.log('foo');
}

// 或者写成
function foo() {
  console.log('foo');
}
export default foo;

// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

对比一下默认输出和正常输出

```
// 输出
export default function crc32() {
  // ...
}
// 输入
import crc32 from 'crc32';

// 输出
export function crc32() {
  // ...
};
// 输入
import {crc32} from 'crc32';
```

export default 命令用于指定模块的默认输出，显然，一个模块只能有一个默认输出，因此 export default 命令只能使用一次。所以，import 命令后面才不用加大括号，因为只能对应一个方法。

### 6. 模块的继承

模块之间可以继承。

```
// circleplus.js

export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}
```

### 7. ES6 模块加载的实质

ES6 模块加载的机制，与 CommonJS 模块完全不同。 CommonJS 模块输出的是一个值得拷贝，而 ES6 模块输出的是值得引用。

CommonJS 模块输出的是被输出值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

```
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

可以通过函数得到内部变动的值。

ES6 模块的运行机制与 CommonJS 不一样，它遇到模块加载命令 import 时，不会去执行模块，而是只生产一个动态的只读引用。等到真的需要用到时候，再到模块里面去取值。ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

```
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

由于 ES6 输入的模块变量，只是一个符号链接，所以这个变量是只读的，对它进行重新赋值会报错。

```
// lib.js
export let obj = {};

// main.js
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // TypeError
```

export 通过接口，输出的是同一值。不同的脚本加载这个接口，得到的都是同样的实例。

```
// mod.js
function C() {
  this.sum = 0;
  this.add = function () {
    this.sum += 1;
  };
  this.show = function () {
    console.log(this.sum);
  };
}

export let c = new C();
```

不同的脚本加载这个模块，得到的都是同一个实例。

### 8. 循环加载

循环加载指的是，a 脚本的执行依赖 b 脚本，而 b 脚本的执行又依赖 a 脚本。

```
// a.js
var b = require('b');

// b.js
var a = require('a');
```

循环加载表示存在强耦合，如果处理不好，可能导致递归加载，使得程序无法执行。

#### CommonJS 模块的加载原理

CommonJS 的一个模块，就是一个脚本文件，require 命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。

```
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```

这是 Node 内部加载模块后生成的一个对象，该对象的 id 属性是模块名，exports 属性是模块输出的各个接口，loaded 属性是一个布尔值，表示该模块的脚本是否执行完毕。

以后需要用到这个模块的时候，就会到 exports 属性上取值。即使再次执行 require 命令，也不会再次执行该模块，而是到缓存之中取值。

#### CommoJS 模块的循环加载

CommonJS 模块的重要特性是加载时执行，即脚本代码在 require 的时候，就会全部执行。一旦出现某个模块被 "循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

```
// a.js
exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');

// b.js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');

// main.js
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);

// $ node main.js
在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
```

CommonJS 输入的是被输出值得拷贝，不是引用。

#### ES6 模块的循环加载

ES6 模块是动态引用，如果使用 import 从一个模块加载变量，那些变量不会被缓存，而是成为一个指向被加载模块的引用。

```
// a.js
import {bar} from './b.js';
export function foo() {
  console.log('foo');
  bar();
  console.log('执行完毕');
}
foo();

// b.js
import {foo} from './a.js';
export function bar() {
  console.log('bar');
  if (Math.random() > 0.5) {
    foo();
  }
}
```

```
$ babel-node a.js
foo
bar
执行完毕

// 执行结果也有可能是
foo
bar
foo
bar
执行完毕
执行完毕
```

代码解析过程。

```
// a.js

// 这一行建立一个引用，
// 从`b.js`引用`bar`
import {bar} from './b.js';

export function foo() {
  // 执行时第一行输出 foo
  console.log('foo');
  // 到 b.js 执行 bar
  bar();
  console.log('执行完毕');
}
foo();

// b.js

// 建立`a.js`的`foo`引用
import {foo} from './a.js';

export function bar() {
  // 执行时，第二行输出 bar
  console.log('bar');
  // 递归执行 foo，一旦随机数
  // 小于等于0.5，就停止执行
  if (Math.random() > 0.5) {
    foo();
  }
}
```

### 9. 跨模块变量

```
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;

// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3
```

### 10. ES6 模块的转码

- ES6 module transpiler
- SystemJS

### 原文链接

[http://es6.ruanyifeng.com/#docs/module](http://es6.ruanyifeng.com/#docs/module)



