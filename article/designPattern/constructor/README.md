构造函数用于创建特定类型的对象——不仅声明了使用的对象，构造函数还可以接受参数以便第一次创建对象的时候设置对象的成员值。

在JavaScript里，构造函数通常是认为用来实现实例的，JavaScript没有类的概念，但是有特殊的构造函数。

通过new关键字来调用定义的构造函数，你可以告诉JavaScript你要创建一个新对象并且新对象的成员声明都是构造函数里定义的。在构造函数内部，this关键字引用的是新创建的对象。

JavaScript里函数有个原型属性叫prototype，当调用构造函数创建对象的时候，所有该构造函数原型的属性在新创建对象上都可用。

如果在构造函数内部定义方法，会在每次创建对象的时候都会重新定义，比较好的方法是让所有对象都能共享方法。

code

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.getInfo = function() {
  console.log('name: ' + this.name + '; age: ' + this.age)
}

var p1 = new Person('slogeor', 18);
p1.getInfo(); //name: slogeor; age: 18
p1 instanceof Person; //true

var p2 = Person('tom', 28);
window.name; //tom
typeof p2; //undefined

针对忘记使用new 定义对象，可以通过强制使用new方法来完美解决。

code

function Person(name, age) {
  if (!(this instanceof Person)) {
    return new Person(name, age);
  }

  this.name = name;
  this.age = age;
}

Person.prototype.getInfo = function() {
  console.log("name: " + this.name + "; age: " + this.age)
}

var p1 = Person("slogeor", 20);
p1.getInfo(); //name: slogeor; age: 20

var p2 = new Person("slogeor", 20);
p2.getInfo(); //name: slogeor; age: 18

console.log(p1 === p2); //false