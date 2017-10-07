## Class

### 1. 基本语法

#### 概述

ES6 引入 Class 概念，作为对象的模板。通过 Class 关键字可以定义类。 ES6 的 Class 可以看作一个语法糖，它的绝大部分功能，ES5 都可以做到。

```
// ES5
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);

// ES6
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

ES6 的类，完全可以看做构造函数的另一种写法。

```
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```

类的内部所有定义的方法，都是不可以枚举的。

```
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

这一点的行为与 ES5 是不一致的。

```
var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function() {
  // ...
};

Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

#### constructor 方法

constructor 方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。一个类必须有 constructor 方法，如果没有显示定义，一个空的 constructor 方法会被添加。

类的构造函数，不使用 new 是没法调用的，普通的构造函数是可以不用 new 的。

#### 类的实例对象

生成类的实例对象，必须要使用 new 命令。

与 ES5 一样，实例的属性除非显示定义在其本身，否则都是定义在原型上。

```
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```
与 ES5 一样，类的所有实例共享一个原型对象。

```
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__ === p2.__proto__
//true
```

这样意味着，可以通过实例的 __proto__ 属性为 Class 添加方法，但不推荐使用。

#### 不存在变量提升

Class 不存在变量提升(hoist)

```
new Foo(); // ReferenceError
class Foo {}
```

#### Class

类也可以使用表达式的形式定义

```
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```

需要注意的是，这个类的名字是 Myclass，而不是 Me，Me 只能在 Class 内部使用。

```
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```

采用 Class 表达式，可以写出立即执行的 Class。

```
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```

#### 私有方法

私有方法是常见需求，但 ES6 不提供。但可以利用 Symbol 值得唯一性，将私有方法的名字命名为一个 Symbol 值。

```
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass{

  // 公有方法
  foo(baz) {
    this[bar](baz);
  }

  // 私有方法
  [bar](baz) {
    return this[snaf] = baz;
  }

  // ...
};
```

#### this 的指向

```
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

PrintName 方法中的 this 默认指向 Logger 类的实例。但是将这个方法提取出来单独封装使用，this 会指向该方法运行时所在的环境，因为找不到 print 方法而报错。

解决方案就是使用箭头函数。

```
class Logger {
  constructor() {
    this.printName = (name = 'there') => {
      this.print(`Hello ${name}`);
    };
  }

  // ...
}
```

#### 严格模式

类和模块的内部，默认就是严格模式，不需要使用 use strict 指定运行模式。

#### name 属性

由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被 Class 继续，包括 name 属性，name 属性总是返回紧跟在 class 关键字后面的类型。

### 2. Class 的继承

#### 基本用法

Class 之间可以通过 extends 关键字实现继承。

```
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```

子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。因为子类没有自己的 this 对象，而是继承父类的 this 对象，然后对其进行加工。

ES5 的继承，实质上是先创造子类的实例对象 this，然后在将父类的方法添加到 this 上面(Parent.apply(this))。

ES6 的继承机制是先创造父类的实例对象 this，然后在调用子类的构造函数修改 this。

不管父类有没有显示定义 constructor，子类必须都要有 constructor 方法。

```
constructor(...args) {
  super(...args);
}
```

需要注意的是，在子类的构造函数中，只有调用 super 之后，才可以使用 this 关键字，否则会报错。

```
let cp = new ColorPoint(25, 8, 'green');

cp instanceof ColorPoint // true
cp instanceof Point // true
```

#### 类的 prototype 属性和 `__proto__` 属性

ES5 中，每一个对象都有 `__proto__` 属性，指向对应的构造函数的 prototype 属性。 Class 作为构造函数的语法糖，同时也有 prototype 属性和 `__proto__` 属性。

- 1. 子类的 `__proto__` 属性，表示构造函数的继承，总是指向父类
- 2. 子类的 prototype 属性的 `__proto__` 属性，表示方法的继承，总是指向父类的 prototype 属性

```
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

类继承的实现

```
class A {
}

class B {
}

// B的实例继承A的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B继承A的静态属性
Object.setPrototypeOf(B, A);

Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```

#### Extends 的继承目标

extends 关键字后面可以跟多种类型的值。

```
class B extends A {
}
```
只要是一个有 prototype 属性的函数，都能被 B 继承。


#### Object.getPrototypeOf()

Object.getPrototypeOf  方法可以用来从子类上获取父类

#### super 关键字

- 1. 作为函数调用(super.(...args))，代表父类的构造函数
- 2. 作为对象调用(super.method())，代表父类。

#### 实例的 `__proto__` 属性

子类实例的 `__proto__` 属性的 `__proto__` 属性，指向父类实例的 `__proto__` 属性。

```
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
```

### 3. 原生构造函数的继承

原生构造函数是指语言内置的构造函数，通常用来生成数据结构。

- Boolean()
- Number()
- String()
- Array()
- Date()
- Function()
- RegExp()
- Error()
- Object()

ES6 运行继承原生构造函数定义子类，因为 ES6 是先新建父类的构造对象 this，然后在用子类的构造函数修饰 this，使得父类的所有行为都可以继承。

```
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```

但继承 Object 的子类，有一个行为差异。

```
class NewObj extends Object{
  constructor(){
    super(...arguments);
  }
}
var o = new NewObj({attr: true});
console.log(o.attr === true);  // false
```

NewObj 继承了 Object，但是无法通过 super 方法向父类 Object 传参，因为 ES6 改变了 Object 构造函数的行为，一旦发现 Object 方法不是通过 new Object() 这种形式调用的，ES6 规定 Object 构造函数会忽略参数。

### 4. Class 的取值函数(getter)和存值函数(setter)

```
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter
```

### 5. Class 的 Generator 方法

```
class Foo {
  constructor(...args) {
    this.args = args;
  }
  * [Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}

for (let x of new Foo('hello', 'world')) {
  console.log(x);
}
// hello
// world
```

### 6. Class 的静态方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前加上 static 关键字，就表示该方法不会被实例继承。而是直接通过类调用，被称为静态方法。

```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```
父类的静态方法可以被子类继承。

```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod(); // 'hello'
```

静态方法也可以从 super 对象上调用。

```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ', too';
  }
}

Bar.classMethod();
```

### 7. Class 的静态属性和实例属性

静态属性指的是 Class 本身的属性，即 Class.propname，而不是定义在对象实例(this) 上的属性。

```
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
```

ES6 明确规定，Class 内部只有静态方法，没有静态属性。

ES7 有一个静态属性的提案，目前 Babel 转码器已经支持。

- 1. 类的实例属性

类的实例属性可以用等式，写入类的定义中

```
class MyClass {
  myProp = 42;

  constructor() {
    console.log(this.myProp); // 42
  }
}
```
- 2. 类的静态属性

类的静态属性只要在上面的实例属性写法前面加上 static 关键字就可以。

```
// 新写法
class Foo {
  static prop = 1;
}
```

### 8. new.target 属性
new 是从构造函数声明实例的命令。ES6 为 new 命令引入一个 new.target 属性，返回 new 命令作用于的那个构造函数。如果构造函数不是通过 new 命令调用的，new.target 会返回 undefined

```
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用new生成实例');
  }
}
```

这样的代码可以确保构造函数只能通过 new 命令调用。

Class 内部调用 new.target，返回当前 Class。

```
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}

var obj = new Rectangle(3, 4); // 输出 true
```

当子类继承父类时，new.target 会返回子类。

```
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  }
}

class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}

var obj = new Square(3); // 输出 false
```

### 9. Mixin 模式的实现

Mixin 模式指的是，将多个类的接口混入另一个类。使用的时候，只要继承这个类即可。

```
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```

### 原文链接

[http://es6.ruanyifeng.com/#docs/class](http://es6.ruanyifeng.com/#docs/class)



 