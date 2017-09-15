### 单例模式

单例就是保证一个类只有一个实例，实现的方法一般是先判断实例存在与否，如果存在直接返回，如果不存在就创建了再返回，这就确保了一个类只有一个实例对象

code

var Singleton = (function() {
  var instance;

  function init() {
    return {
      publicProperty: 'slogeor',
      publicMethod: function() {
        console.log('hello slogeor');
      }
    }
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  }
}());


var instance1 = Singleton.getInstance();
var instance2 = Singleton.getInstance();

console.log(instance1 === instance2); //true


使用场景：一般是用在系统间各种模式的通信协调上

code

var SingletonTester = (function() {

  function Singleton(name) {
    this.name = name;
  }

  var instance;

  var _static = {
    age: 20,
    getInstance: function(args) {
      if (!instance) {
        instance = new Singleton(args);
      }
      return instance;
    }
  };

  return _static;
}());

var singletonTest = SingletonTester.getInstance('slogeor');

singletonTest.name; //slogeor

其他实现

code

function Singleton() {
  //缓存实例
  var instance = this;

  this.name = 'slogeor';

  // 重写构造函数
  Singleton = function() {
    return instance;
  }
}

var s1 = new Singleton();
var s2 = new Singleton();

s1 === s2; // true

http://www.cnblogs.com/TomXu/archive/2012/02/20/2352817.html