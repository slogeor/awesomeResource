## 异步操作和Async函数

ES6 诞生之前，异步编程的方法主要有四种。

- 回调函数
- 事件监听
- 发布/订阅
- Promise 对象

ES6 将 JavaScript 异步编程带入一个全新的阶段，ES7 的 Async 函数更是提出异步编程的终极解决方案。

### 1. 基本概念

#### 异步

所谓的异步，简单说就是一个任务分成两段，先执行第一段，然后转而执行其它任务，等做好了准备，再回过头执行第二段。

#### 回调函数

回调函数就是把任务的第二段单独写在一个函数里，等到重新执行这个任务的时候，就直接调用这个函数。

#### Promise

回调函数多重嵌套，代码不是纵向发展，而是横向发展，很快就会乱成一团，无法管理。这种情况被称为回调函数噩梦。

Promise 就是为了解决这个问题而被提出的。它不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套改成链式调用。

Promise 的最大问题就是代码冗余，原来的任务被 Promise 包装了一下，不管什么操作，一眼看去都是一堆 then，原来的语义变得不清楚。

### 2. Generator 函数

#### 协程

协程就是多个线程相互协作，完成异步任务。

运行流程如下。

- 1. 协程 A 开始执行
- 2. 协程 A 执行到一半，进入暂停，执行权移交到协程 B
- 3. 一段时间后，协程 B 交换执行权
- 4. 协程 A 恢复执行

```
function *asyncJob() {
  // ...其他代码
  var f = yield readFile(fileA);
  // ...其他代码
}
```

函数 asyncJob 就是一个协程，它的奥妙就是在其中的 yield 命令。它表示执行到此处，执行权将交给其他协程。也就是说 yield 命令是异步两个阶段的分界线。

协程遇到 yield 命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点，就是代码的写法非常像同步操作，如果去除 yield 命令，简直一模一样。

#### Generator 函数

Generator 函数式协程在 ES6 的实现，最大特别就是可以交出函数的执行权。

Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。还有函数体内外的数据交换和错误处理机制。

next 方法返回值得 value 属性，是 Generator 函数向外部输出数据；next 方法还可以接受参数，这是向 Generator 函数体内输入数据。

```
function* gen(x){
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next(2) // { value: 2, done: true }
```

第一个 next 方法的 value 属性，返回表达式 x + 2 的值。 第二个 next 方法带有参数 2，这个参数可以传入 Generator 函数，作为上个阶段异步任务的返回结构。

Generator 函数内部可以部署错误处理代码，捕获函数体外抛出的错误。

```
function* gen(x){
  try {
    var y = yield x + 2;
  } catch (e){
    console.log(e);
  }
  return y;
}

var g = gen(1);
g.next();
// {value: 3, done: false}
g.throw('出错了');
// 出错了
```

#### 异步任务的封装

```
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```

### 3. Thunk 函数

#### 参数的求值策略

求值策略即函数的参数到底应该何时求值。

```
var x = 1;

function f(m){
  return m * 2;
}

f(x + 5)
```

f(x + 5) 中的 x + 5 应该何时求值？

- 1. 传值调用

即在进入函数体之前，就计算 x + 5 的值，这是 C 语言采用的策略

- 2. 传名调用

直接将表达式 x + 5 传入函数体，只在用到它的时候求值。Haskell 语言采用这种策略。

#### Thunk 函数的含义

传名调用的实现往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体，这个临时函数就叫做 Thunk 函数。

```
function f(m){
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk){
  return thunk() * 2;
}
```

Thunk 函数是"传名调用"的一种实现策略，用来替换某个表达式。

#### JavaScript 语言的 Thunk 函数

JavaScript 语言是传值调用，它的 Thunk 函数含义有所不同。在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参函数，将其替换成单参数的版本，且只接受回调函数作为参数。

```
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var readFileThunk = Thunk(fileName);
readFileThunk(callback);

var Thunk = function (fileName){
  return function (callback){
    return fs.readFile(fileName, callback);
  };
};
```

Thunk 函数实现

```
// ES5版本
var Thunk = function(fn){
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};

// ES6版本
var Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};
```

栗子

```
function f(a, cb) {
  cb(a);
}
let ft = Thunk(f);

let log = console.log.bind(console);
ft(1)(log) // 1
```
#### Thunk 函数的自动流程管理

```
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // ...
}

run(g);
```

run 函数就是一个 Generator 函数的自动执行器。内部的 next 函数就是 Thunk 的回调函数。next 函数先将指针移到 Generator 函数的下一步，然后判断 Generator 函数是否结束。

执行器执行 Generator 函数方便多了，不管内部有多少个异步操作，直接把 Generator 函数传入 run 函数即可。当然前提是每一个异步操作都是 Thunk 函数，也就是说跟在 yield 命令后面的必须是 Thunk 函数。

```
var g = function* (){
  var f1 = yield readFile('fileA');
  var f2 = yield readFile('fileB');
  // ...
  var fn = yield readFile('fileN');
};

run(g);
```

### 4. co 模块

```
var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

var co = require('co');
co(gen);
```

co 模块可以让你不用编写 Generator 函数的执行器。

co 函数返回的是一个 Promise 对象。

```
co(gen).then(function (){
  console.log('Generator 函数执行完成');
});
```

#### co 模块的原理

Generator 就是一个异步操作的容器，它的自动化执行需要一种机制，当异步操作有了结果，能够自动交回执行权。

两种方法可以做到这一点。

- 1. 回调函数: 将异步操作包装成 Thunk 函数，在回调函数里面交回执行权
- 2. Promise 对象：将异步操作包装成 Promise 对象，用 then 方法交回执行权

### 5. async 函数

ES7 提供了 async 函数，是的异步操作变得更加方便。 async 函数就是 Generator 函数的语法糖。

```
var fs = require('fs');

var readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

写成 async 函数是这样的。

```
var asyncReadFile = async function (){
  var f1 = await readFile('/etc/fstab');
  var f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

从形式上看，async 函数就是将 Generator 函数的星号(*) 替换成 async，将 yield 替换成 await，仅此而已。

async 函数对 Generator 函数的改进主要体现以下四点。

- 1.内置执行器。Generator 函数的执行需要依靠执行器，所以才有了 co 模块，而 async 函数自带执行器。

```
var result = asyncReadFile();
```

`asyncReadFile` 函数会自动执行，输出结果。

- 2.更好地语义。async 和 await 语义更清楚。

- 3.更广的适用性。

co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以是 Promise 对象和原始类型的值。

- 4.返回值是 Promise。

进一步说，async 函数完全可以看做多个异步操作，包装成的一个 Promise 对象，而 await 命令就是内部 then 命令的语法糖。


#### 语法

- 1. async 函数返回一个 Promise 对象
- 2. async函数返回的 Promise 对象，必须等到内部所有 await 命令的 Promise 对象执行完，才会发生状态改变。
- 3. await 命令后面如果不是 Promise 对象，会被转成一个立即 resolve 的 Promise 对象。
- 4. 如果 await 后面的异步操作出错，那么等同于 async 函数返回的 Promise 对象被 reject。

#### async 函数的用法

async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数。当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。

async 函数多种使用方式。

```
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};

```

#### 注意点

- 1. await 命令后面的 Promise 对象，运行结果可能是 rejected，最好把 await 命令放在 try...catch 代码块中

```
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法

async function myFunction() {
  await somethingThatReturnsAPromise()
  .catch(function (err) {
    console.log(err);
  };
}
```

- 2. 多个 await 命令后面的异步操作，如果不存在继发关系，最好让它们同时触发

```
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```
- 3.await 命令只能在 async 函数之中

#### 与 Promise、Generator 的比较

**场景**

假定某个DOM元素上面，部署了一系列的动画，前一个动画结束，才能开始后一个。如果当中有一个动画出错，就不再往下执行，返回上一个成功执行的动画的返回值

- Promise 实现方式

```
function chainAnimationsPromise(elem, animations) {

  // 变量ret用来保存上一个动画的返回值
  var ret = null;

  // 新建一个空的Promise
  var p = Promise.resolve();

  // 使用then方法，添加所有动画
  for(var anim of animations) {
    p = p.then(function(val) {
      ret = val;
      return anim(elem);
    });
  }

  // 返回一个部署了错误捕捉机制的Promise
  return p.catch(function(e) {
    /* 忽略错误，继续执行 */
  }).then(function() {
    return ret;
  });

}
```

- Generator 实现方式

```
function chainAnimationsGenerator(elem, animations) {

  return spawn(function*() {
    var ret = null;
    try {
      for(var anim of animations) {
        ret = yield anim(elem);
      }
    } catch(e) {
      /* 忽略错误，继续执行 */
    }
    return ret;
  });

}
```

- async 实现方式

```
async function chainAnimationsAsync(elem, animations) {
  var ret = null;
  try {
    for(var anim of animations) {
      ret = await anim(elem);
    }
  } catch(e) {
    /* 忽略错误，继续执行 */
  }
  return ret;
}
```

### 6. 异步遍历器

#### 异步遍历的接口

异步遍历器的最大语法特别是调用遍历器的 next 方法，返回的是一个 Promise 对象。

```
asyncIterator
  .next()
  .then(
    ({ value, done }) => /* ... */
  );
```

对象的异步遍历器接口需要部署 Symbol.asyncIterator 属性。

```
const asyncIterable = createAsyncIterable(['a', 'b']);
const asyncIterator = someCollection[Symbol.asyncIterator]();

asyncIterator.next()
.then(iterResult1 => {
  console.log(iterResult1); // { value: 'a', done: false }
  return asyncIterator.next();
}).then(iterResult2 => {
  console.log(iterResult2); // { value: 'b', done: false }
  return asyncIterator.next();
}).then(iterResult3 => {
  console.log(iterResult3); // { value: undefined, done: true }
});
```

异步遍历器返回了两次值。第一次调用的时候，返回一个 Promise 对象，等到 Promise 对象 resolve 了，再返回一个表示当前数据成员信息的对象。鱼就是说 异步遍历器与同步遍历器最终行为是一致的。

#### for await...of

for await...of 循环用于遍历异步的 Iterator 接口

```
async function f() {
  for await (const x of createAsyncIterable(['a', 'b'])) {
    console.log(x);
  }
}
```

for await...of 循环也能用于同步遍历器。

```
(async function () {
  for await (const x of ['a', 'b']) {
    console.log(x);
  }
})();
```

#### 异步 Generator 函数

异步 Generator 函数返回一个异步遍历器对象

```
async function* readLines(path) {
  let file = await fileOpen(path);

  try {
    while (!file.EOF) {
      yield await file.readLine();
    }
  } finally {
    await file.close();
  }
}
```

#### yield* 语句

```
async function* gen1() {
  yield 'a1';
  yield 'b1';
  return 2;
}

async function* gen2() {
  const result = yield* gen1();
  console.log(result); // 2
}

(async function () {
  for await (const x of gen2()) {
    console.log(x); 
  }
  // a
  // b
})();
```
### 原文链接

[http://es6.ruanyifeng.com/#docs/async](http://es6.ruanyifeng.com/#docs/async)
