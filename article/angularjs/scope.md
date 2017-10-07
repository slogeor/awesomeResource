## scope

### Angularjs 中的 scope 的继承

在Angular的条款中，scope也是结合上下文的。AngularJS中，一个scope跟一个元素关联（以及所有它的子元素），而一个元素不是必须直接跟一个scope关联。元素通过以下三中方式被分配一个scope：

1、scope通过controller或者directive创建在一个element上（指令不总是引入新的scope）

2、如果一个scope不存在于元素上，那么它将继承它的父级scope

3、如果一个元素不是某个ng-app的一部分，那么它不属于任何scope。

### 查看 scope 的特殊属性

```
for(o in angular.element($0).scope())o[0]=='$'&&console.log(o)
```

### 事件和服务

当你期望视图模块改变来响应事件，你应该使用 event， 当你不期望视图模块改变，你应该使用 service。有时候响应是这两种的混合：一个动作触发了一个事件，事件调用了一个 service， 或者 service 从 $rootScope广播了一个事件。这视情况而定，并且你应该这样分析，而不是随意使用一个方法。

你有两个组件通过 $rootScope 通信，你可能更喜欢使用 $rootScope.$emit （而不是 $broadcast）和 $rootScope.$on。这种方式下， 事件只会在 $rootScope.$$listeners 之间传播， 那些你知道没有该事件的监听器的后代的 $rootScope上，不会循环浪费时间。

### Digest

AngularJS 基于它的数据绑定的特性，通过循环脏检测来追踪变化并且在变化时触发事件。

* $digest() 执行 $digest 循环脏检测
* $$phase digest 循环的当前阶段， [null, '$apply','$digest'] 中的一个

可以调用$apply() (通常在一个指令里) 用来强制执行一个 $digest()。

$timeout service 替换 setTimeout，它提供了一些错误处理，并且会执行 $apply()。

$apply(expr) 解析和计算一个表达式，然后在 $rootScope 上执行 $digest 循环

有时候你可能要用 $new 声明自己的scope， 但它们使用内部手段处理 scope 的生命周期。

* $$isolateBindings 独立 scope 绑定（例如：{ options: '@megaOptions' }）
* $new(isolate) 创建一个子 scope 或者一个独立的 scope， 它不继承自它们的父级。
* $destroy 从 scope 链里移除该 scope； scope 和后代们不会收到事件， watcher 也不再被触发。
* $$destroyed scope 是否被销毁。

### $rootScope.$emit versus $rootScope.$broadcast

* $rootScope.$emit will fire an event for all $rootScope.$on listeners only
* $rootScope.$broadcast will notify all $rootScope.$on as well as $scope.$on listeners

[codepen](http://codepen.io/slogoer/pen/WGzppE?editors=1011)

### 原文链接
[http://www.w3ctech.com/topic/1611](http://www.w3ctech.com/topic/1611)