## decorator

### 1. 类的装饰

装饰器是一个函数，用来修饰类的行为。这是 ES7 的一个提案，目前 Babel 转码器已经支持。

装饰器对类的行为的改变，是代码编译时发生的，而不是运行时，这意味着，装饰器能在编译阶段运行代码。

```
function testable(target) {
  target.isTestable = true;
}

@testable
class MyTestableClass {}

console.log(MyTestableClass.isTestable) // true
```

@testable 是一个装饰器，它修改了 MyTableClass 这个类的行为，为它加上了静态属性 isTestable。

装饰器的行为基本是这样的。

```
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
```

### TODO

### 原文链接

[http://es6.ruanyifeng.com/#docs/decorator](http://es6.ruanyifeng.com/#docs/decorator)