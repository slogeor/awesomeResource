## 调试 Node

### Debugger

Node 内建了调试协议的客户端，可以在启动时带上 debug 参数可以实现对 JavaScript 代码的调试。

在进行调试前，需要通过 debugeer,语句在代码中设置断点。

```
// index.js
x = 5;

setTimeout(function() {
    debugger
    console.log('world');
}, 1000);
console.log('hello');
```

通过下面的命令进行 debugger

```
➜  node debug ./index.js
```

### Node Inspector

#### 1. 安装 

```
npm install -g node-inspector
```

#### 2. 调试

```
 node-inspector
```
