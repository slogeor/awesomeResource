##异步哪些事

### 基本概念

#### 单线程

Javascript语言的执行环境是单线程（single thread），下图是日常生活很常见的单线程；

![Aaron Swartz](images/1.jpg)

```单线程``` 是指一次只能完成一件任务，如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务，以此类推；

```优点``` 是实现起来比较简单，执行环境相对单纯；不用去考虑诸如资源同步，死锁等多线程阻塞式编程所需要面对的恼人的问题；

```缺点``` 是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。常见的浏览器无响应（假死）等；

为了解决这个问题，Javascript语言将任务的执行模式分成两种：```同步（Synchronous)``` 和```异步(Asynchronous)``` 

#### 同步 VS 异步

```同步模式``` 是后一个任务必须等待前一个任务结束才能执行，程序的执行顺序与任务的排列顺序是一致的、同步的；

```同步模式``` 可以简单的理解为单线程；

```异步模式``` 是每一个任务有一个或多个回调函数（callback），前一个任务结束后，不是执行后一个任务，而是执行回调函数，后一个任务可以不等前一个任务结束就执行，程序的执行顺序与任务的排列顺序是不一致的、异步的；

```异步模式``` 非常重要。在浏览器端，耗时很长的操作都应该异步执行，避免浏览器失去响应，最好的例子就是Ajax操作


#### 回调函数

```回调函数``` 是调用用户提供的函数，该函数往往是以参数的形式提供的;

```js
var fn = function(callback) {
    // do something here
    ...
    callback.apply(this, args);
}；
 
var mycallback = function(parameter) {
    // do someting in customer callback
}；
 
// call the fn with callback as parameter
fn(mycallback);
```

###异步

#### 概念

```异步``` 是函数的调用并不直接返回执行的结果，而往往是通过回调函数异步的执行；

笼统地说，异步就是延时执行；严格来说，异步编程能力都是由 ```BOM``` 与 ```DOM``` 提供的，如```setTimeout``` ，```XMLHttpRequest``` ，DOM的事件机制，HTML5的 ```webwork``` , ```postMessage``` 等

主要目的是处理非阻塞，在和HTML交互的过程中，会需要一些IO操作（典型的就是Ajax请求，脚本文件加载），如果这些操作是同步的，就会阻塞其它操作，用户的体验就是页面失去了响应

```code
 setTimeout(function(){
    console.log("this will be exectued after 1 second!");
},1000);
```

都有一个共同的特点 ```就是拥有一个回调函数，实现控制反转```

#### 四种方法

1、回调函数

```code
//同步操作
f1();  
f2();  
//如果f1是一个很耗时的任务，可以考虑改写f1，把f2写成f1的回调函数。
//异步操作
function f1(callback){
	setTimeout(function () {
　　	// f1的任务代码
　　　　callback();
　　}, 1000);
}
f1(f2);
```

同步操作变成了异步操作，f1不会堵塞程序运行，相当于先执行程序的主要逻辑，将耗时的操作推迟执行。

优点：简单、容易理解和部署

###### 缺点

1.代码可读性低

```js
//某个操作需要经过多个非阻塞的IO操作，每一个结果都是通过回调
f1(function(err, result) {
    f2(function(err, result) {
        f3(function(err, result) {
            f4(function(err, result) {
                f5(function(err, result) {
                    // do something useful
                })
            })
        })
    })
})
```

2.异常和错误处理

```js
//使程序更健壮，我们还需要加入异常处理
//无法在调用的时候通过try…catch的方式来处理异常
function throwError(){
  throw new Error('ERROR');
}
 
try{
  setTimeout(throwError, 3000);
} catch(e){
  alert(e);//这里的异常无法捕获
}
```

3.setTimeout 函数的及时性问题

```js
//setTimeout 是存在一定时间间隔的
//并不是设定n毫秒执行，它就是n毫秒执行
//可能会有一点时间的延迟（2ms左右）

var star, end;
star = window.performance.now();
setTimeout(function(){
    end = window.performance.now();
    console.log(end-star)
}, 5);
```

4.每个任务只能指定一个回调函数

```总结``` 异步编程最基本的方法,也是最简单、最容易实现的


2、事件驱动

采用事件驱动模式，任务的执行不取决于代码的顺序，而取决于某个事件是否发生

优点：比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以”去耦合"（Decoupling），有利于实现模块化

缺点：整个程序都要变成事件驱动型，运行流程会变得很不清晰

```code
f1.on('done', f2);

function f1(){
　　　　setTimeout(function () {
　　　　　　// f1的任务代码
　　　　　　f1.trigger('done');
　　　　}, 1000);
　　}     
```

3、发布/订阅

存在一个 ```信号中心```，某个任务执行完成，就向信号中心 ```发布``` （publish）一个信号，其他任务可以向信号中心 ```订阅``` （subscribe）这个信号，从而知道什么时候自己可以开始执行

我们可以通过查看 ```消息中心``` ，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行

```code
//订阅done信号
jQuery.subscribe("done", f2);

function f1(){
	setTimeout(function () {
　　	// f1的任务代码
　　	//f1执行完成后，向"信号中心"jQuery发布"done"信号，从而引发f2的执行 
　　　	
　　　	jQuery.publish("done");
　　}, 1000);
} 
```
这就叫做 ```发布/订阅模式```（publish-subscribe pattern），又称 ```观察者模式```（observer pattern）

4、Promise对象

思想：每一个异步任务返回一个Promise对象，该对象有一个then方法，允许指定回调函数。比如，f1的回调函数f2,可以写成： f1().then(f2);

回调函数变成了链式写法，程序的流程可以看得很清楚，而且有一整套的配套方法，可以实现许多强大的功能

缺点：编写和理解都相对比较难


###Promise对象  

<a href="https://github.com/slogeor/plugins/tree/master/promise" target="_blank">点击这里</a>

###精简版Promise.js

<a href="https://github.com/slogeor/plugins/blob/master/promise/lib/promise.js" target="_blank">点击这里</a>

### 参考链接

<a href="http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html" target="_blank">Javascript异步编程的4种方法</a>

<a href="http://web.jobbole.com/82291/" target="_blank">探索Javascript异步编程</a>

<a href="http://segmentfault.com/a/1190000002545312" target="_blank">JavaScript异步编程原理</a>