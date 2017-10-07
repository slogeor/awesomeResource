## 前端自动化测试 - todo

### 背景

测试是完善的研发体系中不可或缺的一环。前端同样需要测试。

- css改动可能导致页面错位
- js改动可能导致功能不正常

目前很多人依旧以手工测试为主。

### 为什么需要

一个项目最终会经过快速迭代走向以维护为主的状态，在合理的时机以合理的方式引入自动化测试能有效减少人工维护成本。自动化测试的收益可以简单总结为：

```
自动化的收益 = 迭代次数 * 全手动执行成本 - 首次自动化成本 - 维护次数 * 维护成本
```

- 自动化的收益与迭代次数成正比
- 自动化收益可能为负数：即当自动化成本和维护成本比手动执行成本还高时
- 很多时候自动化成本并不比手动成本高，但是维护成本很高

对于自动化测试来说，相对于发现未知的问题，更倾向于避免可能的问题。

### 好处

对于不断迭代的业务来说，很有必要；写完用例后，对每次迭代都会重复的执行测试，这种投入的性价比是很高的。如果测试总是在正确的时间运行，需求改动后测试失效也会及时的得到通知，及时的更新，整个就良性循环起来了。

### 描述

自动化测试简单来讲，包括用例的撰写，代码的实现，环境的搭建，用例的执行，报表的生成，结果的分析，缺陷报告等等

自动化测试的第一目标从来都不是节省测试的人力成本。成功的自动化测试，作为软件测试的一种工具，从业务最终效果来看，应该是能够节省成本和提高产品质量的。但是把节省测试的人力成本作为自动化测试的直接目标是错误的，而且是致命的。

### 开发模式

#### TDD （Test Driven Development 测试驱动开发）

- 测试来驱动开发
- 其重点偏向开发
- 测试用例是在约束开发者，使开发者的目标明确，设计出满足需求的系统

#### BDD （Behaviour Driven Development 行为驱动开发）

- 基于TDD发展，保持测试先行的理念
- 其重点偏向设计
- 在测试代码中用一种自然通用语言的方式把系统的行为描述出来
- 将系统的设计和测试用例结合起来，进而驱动开发工作

### 分类

#### UI 测试

UI 测试是测试页面交互、功能的测试，有点类似集成测试，是从用户的角度做的测试，测试的结果能反应产品的功能的完整性。

对一些基础产品来说，每周一个迭代，这些细节的回归难免会漏掉，对这种情况做 UI 测试时有必要，在预发时做一次自动的回归即保证了质量，又减少了重复劳动。

#### 单元测试

单元测试的对象是一般是方法、组件；对于前端组件，也会有一些 UI 上的验证，不过测试的整体依然是组件，因此对组件级的 UI 测试也归为单元测试；单元测试对组件 API 设计有要求，要便于测试；便于测试的代码组件化的设计的也是友好的。因此组件化和测试也是一个相辅相成的好基友。

### 可测试方向

- 界面回归测试:  测试界面是否正常
- 功能测试: 测试功能操作是否正常
- 性能测试
- 页面特征检测

### 测试框架

#### 界面回归测试

**像素对比**

如果网站没有因为你的改动而界面错乱，那么在截图上测试页面应当跟正常页面保持一致。像素对比能直观的显示图像上的差异，如果达到一定阈值则页面可能不正常。

**PhantomCSS**

PhantomCSS结合了 Casperjs截图和ResembleJs 图像对比分析。单纯从易用性和对比效果来说还是不错的。

**selenium**

多浏览器测试最出名的当属selenium， selenium可以自动化的获取多个浏览器下的截图，前端工程师来说还可以借助Node的webdriver 来轻松开发测试脚本。

**BackstopJS**

通过PhantomJS、capserJS等工具在不同尺寸下截图然后根据resemberJS进行像素比对判断是否正常。

**dom结构对比**

page-monitor根据dom结构与样式的对比来对比整个页面的变动部分。

#### 功能测试

最直接的功能测试就是模拟用户操作，通过模拟正常的操作流程来判断页面展现是否符合预期。

**PhantomJS**

Phantom JS是一个服务器端的 JavaScript API 的 WebKit。其支持各种Web标准： DOM 处理, CSS 选择器, JSON, Canvas, 和 SVG。对于web测试、界面、网络捕获、页面自动化访问等等方面可以说是信手拈来。

**casperjs**

casperjs是对PhantomJS的封装，提供了更加易用的API, 增强了测试等方面的支持。

**PhantomFlow**

PhantomFlow假定如果页面正常，那么在相同的操作下，测试页面与正常页面的展现应该是一样的。 基于这点，用户只需要定义一系列操作流程和决策分支，然后利用PhantomCSS进行截图和图像对比

#### 性能测试

**Phantomas**

能运行测试页面获取很多性能指标，加载时间、页面请求数、资源大小、是否开启缓存和Gzip、选择器性能、dom结构等等诸多指标都能一次性得到。

### 总结

每个产品都有自身的特点，如果只是粗略的使用这些开源工具，可能达不到想要的效果，需要根据自身的情况选择合理的工具并进行一定的调优。只有不断提高自动化测试的问题定位能力，才能真正发挥自动化的价值。

## 测试框架

### Mocha

#### 1. Mocha 概述

Mocha is a simple, flexible, fun JavaScript test framework for node.js and the browser. 

![http://www.ruanyifeng.com/blogimg/asset/2015/bg2015120301.png](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015120301.png)

#### 2. 断言

"断言"，就是判断源码的实际执行结果与预期结果是否一致，如果不一致就抛出一个错误。

常用的断言库是 chai，并且指定使用 expect 断言风格。

#### 3. 基本用法

Mocha默认运行test子目录里面的测试脚本，所以一般都会把测试脚本放在 test 目录里。

- --recursive 参数会递归遍历执行test下的所有文件
- --reporter参数用来指定测试报告的格式

#### 4. mochawesome 模块

可以生成漂亮的 HTML 格式的报告

mocha demo02/test/add.test.js --reporter mochawesome

#### 5. 其他命令

- --watch:  监听测试脚本
- --bail: 只要有一个测试用例没有通过，就停止执行后面的测试用例
- invert: 只运行不符合条件的测试脚本，必须与--grep参数配合使用

#### 6. 配置 mocha.opts

Mocha 运行在 test 目录下面放置 mocha.opts 配置文件，把命令参数写在里面。

```
--reporter tap
--recursive
--growl
```

此时执行 mocha 与 mocha --recursive --reporter tap --growl 是等效的。

如果测试用例不在 test 子目录，可以在 mocha.opts 写入下面内容。

```
server-tests
--recursive
```

上面代码指定运行 server-tests 目录及子目录中的测试脚本。

mocha.opts 配置文件需要放置在test目录下。

#### 7. ES6测试

测试脚本是用ES6写的，那么运行测试之前，需要先用Babel转码。

首先需要安装 Babel

```
$ npm install babel-core babel-preset-es2015 --save-dev
```

然后在项目目录下，新建一个 .babelrc 配置文件

```
{
  "presets": [ "es2015" ]
}
```

最后 使用 --compilers 参数指定测试脚本的转码器

```
mocha --compilers js:babel-core/register
```

--compilers参数后面紧跟一个用冒号分隔的字符串，冒号左边是文件的后缀名，右边是用来处理这一类文件的模块名。

#### 8. 异步测试

Mocha 默认每个测试用例最多执行 2000 毫秒，如果到时没有得到结果，就会报错。对于涉及异步操作用例，这个时间往往是不够的，需要用 -t 或 -timeout 参数指定超时门槛。

```
it('测试应该5000毫秒后结束', function(done) {
  var x = true;
  var f = function() {
    x = false;
    expect(x).to.be.not.ok;
    done(); // 通知Mocha测试结束
  };
  setTimeout(f, 4000);
});

$ mocha -t 5000 timeout.test.js
```
#### 9. 测试用例的钩子

Mocha在describe块之中，提供测试用例的四个钩子：before()、after()、beforeEach()和afterEach()。

```
describe('hooks', function() {

  before(function() {
    // 在本区块的所有测试用例之前执行
  });

  after(function() {
    // 在本区块的所有测试用例之后执行
  });

  beforeEach(function() {
    // 在本区块的每个测试用例之前执行
  });

  afterEach(function() {
    // 在本区块的每个测试用例之后执行
  });

  // test cases
});
```

#### 10. 测试用例管理

describe块和it块都允许调用only方法，表示只运行某个测试套件或测试用例。

还有skip方法，表示跳过指定的测试套件或测试用例。

#### 11. 生成规格文件

- 生成 md 格式的文件: mocha --recursive -R markdown > spec.md
- 生成 html 格式的文件: mocha --recursive -R doc > spec.html

### 参考链接

- [demo](https://github.com/ruanyf/mocha-demos)
- [http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)


## Istanbul

### 代码覆盖率

测试的时候，我们关心是否所有的代码都测试到了，这个指标就叫代码覆盖率，代码覆盖率有四个测量维度。

- 行覆盖率率(line coverage): 是否每一行都执行了
- 函数覆盖率(function coverage): 是否每个函数都调用了
- 分支覆盖率(branch coverage): 是否每个if代码都执行了
- 语句覆盖率(statement coverage): 是否每个语句都执行了

### 覆盖率门槛

```
istanbul check-coverage --statement -5 --branch -3 --function 100
```

设置了3个覆盖率门槛：5个语句、3个 if 代码块、100%的函数。注意，这三个门槛是"与"（and）的关系，只要有一个没有达标，就会报错。

### 应用

sqrt.js

```
var My = {
  sqrt: function(x) {
    if (x < 0) throw new Error("负值没有平方根");
      return Math.exp(Math.log(x)/2);
    }
};

module.exports = My;
```

测试脚本 test.sqrt.js

```
var chai = require('chai');
var expect = chai.expect;
var My = require('./sqrt.js');

describe("sqrt", function() {

  it("4的平方根应该等于2", function() {
    expect(My.sqrt(4)).to.equal(2);
  });

  it("参数为负值时应该报错", function() {
    expect(function(){ My.sqrt(-1); }).to.throw("负值没有平方根");
  });

});
```

执行代码覆盖率命令

```
istanbul cover _mocha -- tests/test.sqrt.js -R spec
```

istanbul cover 命令后面跟的是 _mocha 命令，mocha 会新建一个进程执行测试，_mocha 是在当前进程执行测试，只有这样，Istanbul 才会捕捉到覆盖率数据。

### 忽略某些代码

istanbul 提供注释语法，允许某些代码不计入覆盖率。

```
/* istanbul ignore if  */
if (hardToReproduceError)) {
    return callback(hardToReproduceError);
}
```

### 参考链接

[http://www.ruanyifeng.com/blog/2015/06/istanbul.html](http://www.ruanyifeng.com/blog/2015/06/istanbul.html)


















## 参考链接

- [Mocha](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)
- [前端自动化测试探索](http://fex.baidu.com/blog/2015/07/front-end-test/)
- [https://github.com/tmallfe/tmallfe.github.io/issues/37](https://github.com/tmallfe/tmallfe.github.io/issues/37)
- [http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html](http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)