## Promise 对象

### 1. Promise 

所谓 Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

```
var p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

var p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```

### 2. Promise.prototype.then()

then 方法返回的是一个新的 Promise 实例，不是原来那个实例。

```
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
```

上面的代码使用then方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

### 3. Promise.prototype.catch()

Promise.prototype.catch 方法是 .then(null, rejection)的别名，用于指定发生错误的回调函数。

```
getJSON("/posts.json").then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```

如果 Promise 状态已经变成 Resolved，再抛出错误是无效的。

Promise 对象的错误具有冒泡性质，会一直向后传递，直到被捕获为止。

```
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

这段代码有三个 Promise 对象，一个由 getJson 产生，两个由 then 产生。它们之中任何一个抛出错误，都会被最后一个 catch 捕获。

一般来说，不要在 then 方法里定义 Reject 状态的回调函数，总是使用 catch 方法。

catch 方法返回的还是一个 Promise 对象，因此后面还可以接着调用 then 方法。

```
var someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
// oh no [ReferenceError: x is not defined]
// carry on
```

这段代码运行完 catch 方法指定的回调函数，会接着运行后面那个 then 方法指定的回调函数。

### 4. Promise.all()

Promise.all 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

Promise.resolve 方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。

```
var p = Promise.all([p1, p2, p3]);
```

p 的状态有 p1，p2，p3 决定。

- 只有 p1、p2、p3 的状态都变成 fulfilled，p 的状态才变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传给给 p 的回调函数
- 只要 p1、p2、p3 之中有一个被 rejected，p 的状态就变成 rejected，此时第一个被 rejected 的实例的返回值，会传递给 p 的回调函数

### 5. Promise.race()


Promise.race 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```
var p = Promise.race([p1,p2,p3]);
```

只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就会跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。

### 6. Promise.resolve()

有时候需要将现有对象转为 Promise 对象，Promise.resolve 方法就是起到这个作用。

```
var jsPromise = Promise.resolve($.ajax('/whatever.json'));
```

将 jQuery 生成的 deferred 对象，转为一个新的 Promise 对象。

```
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

- 1. 参数是一个 Promise 实例

Promise.resolve 将不会做任何修改。原封不动的返回

- 2. 参数是一个 thenable 对象

thenable 对象指的具有 then 方法的对象。

```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
```

Promise.resolve 方法会将这个对象转为 Promise 对象，然后立即执行 thenable 对象的 then 方法。

```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});
```

- 3. 参数不是具有 then 方法的对象，或根本就不是对象

Promise.resolve 方法返回一个新的 Promise 对象，状态为 Resolved。

```
var p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
```

由于字符串 Hello 不属于异步操作，返回 Promise 实例的状态从一生成就是 Resolved，所以回调函数会立即执行。 Promise.resolve 方法的参数，会同时传给回调函数。

- 4. 不带有任何参数

Promise.resolve 方法允许调用时不带参数，直接返回一个 Resolved 状态的 Promise 对象。

所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用 Promise.resolve 方法。

```
var p = Promise.resolve();

p.then(function () {
  // ...
});
```

需要注意的是，立即 resolve 的Promise 对象，是在本轮事件循环的结束时，而不是下一轮事件循环的开始时。

```
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```

setTimeout(fn, 0) 在下一轮事件循环开始时执行，Promise.resolve() 在本轮事件循环结束时执行，console.log('one') 则是立即执行。

### 7. Promise.reject()

Promise.reject(reason) 方法会返回一个新的 Promise 实例，该实例的状态为 rejected。它的参数用法与 Promise.resolve 方法一致。

```
var p = Promise.reject('出错了');
// 等同于
var p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s){
  console.log(s)
});
// 出错了
```

### 8. done() 和 finally()

#### done()

Promise 对象的回调链，不管以 then 方法或 catch 方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到。因此提供了一个 done 方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。

```
asyncFunc()
  .then(f1)
  .catch(r1)
  .then(f2)
  .done();
```

done() 的实现也很简单

```
Promise.prototype.done = function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected)
    .catch(function (reason) {
      // 抛出一个全局错误
      setTimeout(() => { throw reason }, 0);
    });
};
```

#### finally()

finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。 与 done 的最大区别是: 它接受一个普通的回调函数作为参数，该参数不管怎样都必须执行。

```
server.listen(0)
  .then(function () {
    // run test
  })
  .finally(server.stop);
```

finally() 的实现也很简单

```
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

### 9. 应用

简单的将图片的加载写成一个 Promise，一旦加载完成，Promise 的状态就发生了变化。

```
const preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```

### 原文链接

[http://es6.ruanyifeng.com/#docs/promise](http://es6.ruanyifeng.com/#docs/promise)