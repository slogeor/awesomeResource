## 自动化测试


### 背景

JavaScript 作为 Web 端使用最广泛的编程语言，它是动态语言，缺乏静态类型检查，所以在代码编译期间，很难发现像变量名写错，调用不存在的方法等错误，除非在运行时才能暴露出来，所以非常有必要有一个测试工具来验证你的代码。

### 为什么需要测试

#### 从语言角度

- JavaScript 是动态语言， 缺少类型检查，编译期间无法定位到错误
- JavaScript 宿主的兼容性问题， 比如 DOM 操作在不同浏览器上的表现

#### 从工程角度

- TDD 被证明是有效的软件编写原则，它能覆盖更多的功能接口
- 测试可以快速反馈你的功能输出，验证你的想法
- 测试可以保证代码重构的安全性，没有一成不变的代码，测试用例能给你多变的代码结构一个定心丸
- 测试用例其实可以看成代码 API 使用文档，而且还是定时更新的，对 API 的使用者有很大的帮助
- 易于测试的代码，说明是一个好的设计

### 测试种类

- 单元测试: 针对函数或模块的测试
- 集成测试: 针对整体产品的某个功能的测试，又称功能测试
- 端对端测试: 从用户界面直达数据库的全链路测试

### 面临的现状

像 Java， Python ，C#， 测试工具基本都会集成到 IDE 中，基本都能马上看到测试结果

C++ 这种编译性语言，在编译期间基本都会找到代码里的错误

前端开发者对测试都不是很依赖，因为缺少好用的工具，甚至都不会去写测试

### 解决方案

#### Selenium

Selenium 是一个完整的测试工具，比较适合用来做高级测试，比如 e2e 测试。

核心思想就是代理注入，Selenium 通过代理打开浏览器 URL， 有一个后台的 server 在监听，当有请求时，会往浏览器中注入脚本，之后就通过这个脚本来跟 server 端通讯。

#### WebDriver/Selenium 2

WebDriver 是基于 HTTP 协议来跟浏览器通讯的，Selenium 2 实现了完整的 WebDriver 协议。

WebDriver 可以调用更底层的 DOM API， 像 Safari 不支持这种协议的话，就采用 Selenium 1 那种代理注入的方式通讯。

#### Mocha

主要用在 Node.js里的单元测试，也可以用在浏览器端，不过得手动配置各种适配脚本。

#### JsTestDriver

JsTestDriver 是直接在浏览器里执行的，可以直接调用 DOM 和浏览器端 API， 不过先得开启一个服务端程序， 它的核心是一个 runner 程序，当运行单测时，runner 会通知服务端来更新浏览器端，比如重新加载 js 脚本，返回测试结果到服务端。

#### HTML Runners

开发者要自己维护加载的前端资源， 手动刷新页面， 测试结果以 HTML 形式显示

![http://gtms04.alicdn.com/tps/i4/TB1eweqLXXXXXbvaXXX0ucn3VXX-964-384.png](http://gtms04.alicdn.com/tps/i4/TB1eweqLXXXXXbvaXXX0ucn3VXX-964-384.png)

## karma

### 介绍

Karma 是 Testacular 的新名字，在 2012 年 Google 开源了Testacular，2013 年 Testacular 改名为 Karma。Karma 是一个让人感到非常神秘的名字，表示佛教中的缘分，因果报应，比 Cassandra这种名字更让人猜不透！

Karma 是一个基于 Node.js 的 JavaScript 测试执行过程管理工具（Test Runner）。

- 可以测试所有主流 Web 浏览器，
- 可以集成到 CI（Continuous integration）工具
- 可以和其他代码编辑器一起使用

Karma 的一个强大特性是：可以监控(Watch)文件的变化，然后自行执行，通过 console.log 显示测试结果

Karma 是一个 runner，旨在帮助开发者简单而又快速的进行自动化单元测试。

目前已经用在很多大型的项目， Google 和 YouTube 这些公司都在用它。

### 目标

- 在真实环境中测试
- 支持远程控制
- 执行速度快
- 可以跟第三方 IED 进行交换
- 支持 CI 服务
- 高扩展性，支持插件开发
- 支持调试

### 设计分析

#### 设计目标

- 高效
- 扩展性
- 运行在真实设备
- 无缝的使用流程

Karam 是一个 C/S 程序，包含 client 和 server ，通讯方式基于 Http ，通常情况下，客户端和服务端基本都运行在开发者本地机器上。

![http://gtms04.alicdn.com/tps/i4/TB13X9xLXXXXXXoaXXXDUoU9pXX-902-329.png](http://gtms04.alicdn.com/tps/i4/TB13X9xLXXXXXXoaXXXDUoU9pXX-902-329.png)

#### Server

Server 端运行在开发者机器上，根据测试配置文件，它能快速的访问本地测试文件，Server 内部保存了所有的程序运行状态，提供的功能主要有。

- 监听文件
- 向 client 进行通讯
- 向开发者输出测试结果
- 提供 client 端所需要的资源问题

**1. Manager**

Manager 的主要责任就是跟 client 进行通讯，比如广播信号通知 client 开始测试以及收集 client 返回的测试结果。

作为通讯网关，它会利用这两种数据模型去通知服务端其它组成部分，比如测试完成之后，通知输出结果展示。

**2. Web Server**

基于 connect 的一个 server ， 主要是提供访问本地静态资源用的，这里的资源包含：JS 测试框架，断言库，测试用例以及它的依赖等。

**3. Reporter**

展示输出结果，输出端包含本地命令行，文件或者一个 ci server。

**4. File System Watcher**

watcher 主要是监听本地文件改变，内部维护了一个数据模型，包含所有测试相关的文件，它能保证 Web Server拉取的静态资源都是最新的，同时也能保证文件访问成本以及网络成本，永远只加载修改的文件。


#### Client

Client 是测试文件真正运行的地方，比如一个 PC，iphone，tablet 端的浏览器。

**1. Manager**

跟 server 进行消息通讯，以及与其它 client 组成部分进行交互，比如测试框架 mocha。

**2. Testing Framework**

Karma 灵活支持第三方测试框架，以插件的形式接入。

**3. Tests and Code under Test**

含用户所有的测试相关文件，它是通过 web-server 模块来获取，测试文件由 test framework 来执行。

### 实现分析

Karma 是用 JavaScript 实现的， server 端运行在 Node.js 环境下， client 运行在浏览器环境下。

#### Server

![http://gtms04.alicdn.com/tps/i4/TB1WhqVLXXXXXXxXpXXZcaBRpXX-587-609.png](http://gtms04.alicdn.com/tps/i4/TB1WhqVLXXXXXXxXpXXZcaBRpXX-587-609.png)

实线代表直接方法调用，虚线代表通过事件通讯。

#### Client

![http://gtms03.alicdn.com/tps/i3/TB1jTKwLXXXXXX.aXXX0KhCSFXX-619-472.png](http://gtms03.alicdn.com/tps/i3/TB1jTKwLXXXXXX.aXXX0KhCSFXX-619-472.png)

### 参考链接
- [http://taobaofed.org/blog/2016/01/08/karma-origin/](http://taobaofed.org/blog/2016/01/08/karma-origin/)
- [https://www.npmjs.com/package/karma](https://www.npmjs.com/package/karma)
- [http://karma-runner.github.io/1.0/index.html](http://karma-runner.github.io/1.0/index.html)
- [http://mochajs.org/](http://mochajs.org/)
- [http://jasmine.github.io/](http://jasmine.github.io/)
- [http://docs.seleniumhq.org/](http://docs.seleniumhq.org/)