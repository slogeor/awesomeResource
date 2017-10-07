## $parse 服务

### 官方 API

#### 1. $parse

作用：将一个 Angularjs 表达式转出一个函数

#### 2. $parse(expression)

* arguments
	*  expression: 需要被编译的 Angularjs 语句

* return func(content, locals)

	* content[object]: 针对你要解析的语句，这个对象中有你要解析的语句中的表达式(通常是一个 scope object)   
	* locas[object]: 关于 content 中变量的本地变量，对于覆盖 content 中的变量值很有用
	* 返回的函数有三个特征
		* literal[boolean]: 表达式的顶节点是否是一个JavaScript 字面量
		* constant[boolean]: 表达式是否全部由Javascript常量字面量组成
		* assign[func(content, local)]: 可以用来给定的上下文中修改表达式的值 			

#### demo		
* [http://codepen.io/slogoer/pen/mAbOxj](http://codepen.io/slogoer/pen/mAbOxj)
* [http://codepen.io/slogoer/pen/GjKNGX?editors=1011](http://codepen.io/slogoer/pen/GjKNGX?editors=1011)

#### 总结 

```
angular.module("MyApp",[])
.controller("MyController", function($scope, $parse){
    $scope.context = {
        add: function(a, b){return a + b;},
        mul: function(a, b){return a * b}
    }
    $scope.expression = "mul(a, add(b, c))";
    $scope.data = {
        a: 3,
        b: 6,
        c: 9
    };
    var parseFunc = $parse($scope.expression);
    $scope.ParsedValue = parseFunc($scope.context, $scope.data);
});
```
$parse 服务根据 $scope.context 中提供的上下文解析$scope.expression 语句，然后使用 $scope.data 数据填充表达式中的变量。

#### 原文链接
[https://segmentfault.com/a/1190000002749571](https://segmentfault.com/a/1190000002749571)