## Proxy和Reflect

### 1. Proxy 概述

Proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

Proxy可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```
var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

fproxy(1, 2) // 1
new fproxy(1,2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo // "Hello, foo"
```

Proxy 支持的拦截操作一览。

#### get(target, propKey, receiver)

拦截对象属性的读取，比如proxy.foo和proxy['foo']。

#### set(target, propKey, value, receiver)

拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。

#### has(target, propKey)

拦截propKey in proxy的操作，以及对象的hasOwnProperty方法，返回一个布尔值。

#### deleteProperty(target, propKey)

拦截delete proxy[propKey]的操作，返回一个布尔值。

#### ownKeys(target)

拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)，返回一个数组。该方法返回对象所有自身的属性，而Object.keys()仅返回对象可遍历的属性。

#### getOwnPropertyDescriptor(target, propKey)

拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。

#### defineProperty(target, propKey, propDesc)

拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。

#### preventExtensions(target)

拦截Object.preventExtensions(proxy)，返回一个布尔值。

#### getPrototypeOf(target)

拦截Object.getPrototypeOf(proxy)，返回一个对象。

#### isExtensible(target)

拦截Object.isExtensible(proxy)，返回一个布尔值。

#### setPrototypeOf(target, proto)

拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。

#### apply(target, object, args)

拦截Proxy实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。

#### construct(target, args)

拦截Proxy实例作为构造函数调用的操作，比如new proxy(...args)。

### 2. Proxy 实例方法

#### get()

get方法用于拦截某个属性的读取操作。

#### set()

set方法用来拦截某个属性的赋值操作。

#### apply()

apply方法拦截函数的调用、call和apply操作。

#### has()

has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。

has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性。

另外，虽然for...in循环也用到了in运算符，但是has拦截对for...in循环不生效。

#### construct()

construct方法用于拦截new命令。

#### deleteProperty()

deleteProperty方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。

#### defineProperty()

defineProperty方法拦截了Object.defineProperty操作。

```
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar'
// TypeError: proxy defineProperty handler returned false for property '"foo"'
```
defineProperty方法返回false，导致添加新属性会抛出错误。

#### getOwnPropertyDescriptor()

getOwnPropertyDescriptor方法拦截Object.getOwnPropertyDescriptor，返回一个属性描述对象或者undefined。

#### getPrototypeOf() 

getPrototypeOf方法主要用来拦截Object.getPrototypeOf()运算符，以及其他一些操作。

#### isExtensible()

isExtensible方法拦截Object.isExtensible操作。

#### ownKeys()

ownKeys方法用来拦截Object.keys()操作。

#### preventExtensions() 

preventExtensions方法拦截Object.preventExtensions()。该方法必须返回一个布尔值。

#### setPrototypeOf()

setPrototypeOf方法主要用来拦截Object.setPrototypeOf方法。

### 3. Proxy.revocable()

Proxy.revocable方法返回一个可取消的Proxy实例。

```
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```

Proxy.revocable方法返回一个对象，该对象的proxy属性是Proxy实例，revoke属性是一个函数，可以取消Proxy实例。当执行revoke函数之后，再访问Proxy实例，就会抛出一个错误。

### 4. Reflect

Reflect对象的设计目的有这样几个。

- 将 Object 对象的一些明显属于语言内部的方法放到 Reflect 对象上。
- 修改某些 Object 方法的返回结果，让其变得更合理
- 让 Object 操作都变成函数行为
- Reflect 对象的方法与 Proxy 对象的方法是一一对应的，只要 Proxy 对象的方法就能在 Reflect 对象上找到对应的方法。不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为 

### 5. Reflect 对象方法

- Reflect.apply(target,thisArg,args)
- Reflect.construct(target,args)
- Reflect.get(target,name,receiver)
- Reflect.set(target,name,value,receiver)
- Reflect.defineProperty(target,name,desc)
- Reflect.deleteProperty(target,name)
- Reflect.has(target,name)
- Reflect.ownKeys(target)
- Reflect.isExtensible(target)
- Reflect.preventExtensions(target)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.getPrototypeOf(target)
- Reflect.setPrototypeOf(target, prototype)

### 原文链接

[http://es6.ruanyifeng.com/#docs/proxy](http://es6.ruanyifeng.com/#docs/proxy)
