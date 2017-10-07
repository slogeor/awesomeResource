## http 劫持与XSS

### 1. HTTP劫持、DNS劫持与XSS

#### HTTP 劫持

大多数情况是运营商HTTP劫持，当我们使用HTTP请求请求一个网站页面的时候，网络运营商会在正常的数据流中插入精心设计的网络数据报文，让客户端（通常是浏览器）展示“错误”的数据，通常是一些弹窗，宣传性广告或者直接显示某网站的内容。

#### DNS劫持

DNS劫持就是通过劫持了DNS服务器，通过某些手段取得某域名的解析记录控制权，进而修改此域名的解析结果，导致对该域名的访问由原IP地址转入到修改后的指定IP，其结果就是对特定的网址不能访问或访问的是假网址，从而实现窃取资料或者破坏原有正常服务的目的。

#### XSS 跨站脚本

XSS指的是攻击者漏洞，向 Web 页面中注入恶意代码，当用户浏览该页之时，注入的代码会被执行，从而达到攻击的特殊目的。

### 2. 劫持方法

#### 页面被嵌入 iframe 中，重定向 iframe

**方案**

网络运营商为了尽可能地减少植入广告对原有网站页面的影响，通常会通过把原有网站页面放置到一个和原页面相同大小的 iframe 里面去，那么就可以通过这个 iframe 来隔离广告代码对原有页面的影响

**思路**

需要知道我们的页面是否被嵌套在 iframe 中，如果是，则重定向外层页面到我们的正常页面即可。

**解决方案**

发现我们的页面被嵌套在 iframe 时，可以重定向父级页面

```
if (self != top) {
  // 我们的正常页面
  var url = location.href;
  // 父级页面重定向
  top.location = url;
}
```

* window.self: 返回一个指向当前 window 对象的引
* window.top: 返回窗口体系中的最顶层窗口的引用


#### 内联事件及内联脚本拦截

```
1. <a href="javascript:alert(1)" ></a>
2. <iframe src="javascript:alert(1)" />
3. <img src='x' onerror="alert(1)" />
4. <video src='x' onerror="alert(1)" ></video>
5. <div onclick="alert(1)" onmouseover="alert(2)" ><div>
```

#### 静态脚本拦截

XSS 跨站脚本的精髓不在于"跨站"，在于"脚本"。

页面上被注入了一个 ``` <script src="http://attack.com/xss.js"> ``` 脚本，我们的目标就是拦截这个脚本的执行。

**MutationObserver**

MutationObserver 是 HTML5 新增的 API，功能很强大，给开发者们提供了一种能在某个范围内的 DOM 树发生变化时作出适当反应的能力。

#### 动态脚本拦截

```
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'http://www.example.com/xss/b.js';
 
document.getElementsByTagName('body'[0].appendChild(script);　
```

要拦截这类动态生成的脚本，且拦截时机要在它插入 DOM 树中，执行之前，本来是可以监听 Mutation Events 中的 DOMNodeInserted 事件的。

在动态脚本插入执行前，监听 DOM 树的变化拦截它行不通，脚本仍然会执行。

那么我们需要向上寻找，在脚本插入 DOM 树前的捕获它，那就是创建脚本时这个时机。

**重写原生 Element.prototype.setAttribute 方法**

```
// 保存原有接口
var old_setAttribute = Element.prototype.setAttribute;
 
// 重写 setAttribute 接口
Element.prototype.setAttribute = function(name, value) {
 
  // 匹配到 <script src='xxx' > 类型
  if (this.tagName == 'SCRIPT' && /^src$/i.test(name)) {
    // 白名单匹配
    if (!whileListMatch(whiteList, value)) {
      console.log('拦截可疑模块:', value);
      return;
    }
  }
   
  // 调用原始接口
  old_setAttribute.apply(this, arguments);
};
```

**重写 document.write**

```
/**
 * 重写单个 window 窗口的 document.write 属性
 * @param  {[BOM]} window [浏览器window对象]
 * @return {[type]}       [description]
 */
function resetDocumentWrite(window) {
  var old_write = window.document.write;
 
  window.document.write = function(string) {
    if (blackListMatch(keywordBlackList, string)) {
      console.log('拦截可疑模块:', string);
      return;
    }
 
    // 调用原始接口
    old_write.apply(document, arguments);
  }
}
```
**锁死 apply 和 call**

```
// 锁住 call
Object.defineProperty(Function.prototype, 'call', {
  value: Function.prototype.call,
  // 当且仅当仅当该属性的 writable 为 true 时，该属性才能被赋值运算符改变
  writable: false,
  // 当且仅当该属性的 configurable 为 true 时，该属性才能够被改变，也能够被删除
  configurable: false,
  enumerable: true
});

// 锁住 apply
Object.defineProperty(Function.prototype, 'apply', {
  value: Function.prototype.apply,
  writable: false,
  configurable: false,
  enumerable: true
});　
```

我们在重写 Element.prototype.setAttribute 时最后有 old_setAttribute.apply(this, arguments);这一句，使用到了 apply 方法，所以我们再重写 apply ，输出 this ，当调用被重写后的 setAttribute 就可以从中反向拿到原生的被保存起来的 old_setAttribute 了。

使用上面的 Object.defineProperty 可以锁死 apply 和 类似用法的 call 。使之无法被重写，这个时候才算真正意义上的成功重写了我们想重写的属性。

### 3. HTTPS 与 CSP

#### CSP

CSP 即是 Content Security Policy，翻译为内容安全策略。这个规范与内容安全有关，主要是用来定义页面可以加载哪些资源，减少 XSS 的发生。

#### HTTPS

能够实施 HTTP 劫持的根本原因，是 HTTP 协议没有办法对通信对方的身份进行校验以及对数据完整性进行校验。如果能解决这个问题，则劫持将无法轻易发生。

### 4. 参考链接

* [JavaScript防http劫持与XSS](http://www.cnblogs.com/coco1s/p/5777260.html)
* [httphijack.js](https://github.com/chokcoco/httphijack)