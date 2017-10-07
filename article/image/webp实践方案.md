## webp实践方案

#### 浏览器支持情况

![webp支持情况](http://images2015.cnblogs.com/blog/563928/201608/563928-20160824222224026-513072318.png)

### webp转换工具

[webp格式转换工具](https://developers.google.com/speed/webp/)

### 输出webp的方案

#### 1. 服务端输出

支持webp的浏览器在向服务器发送请求时，会在请求头Accept中带上image/webp。然后服务器就可以根据是否含有这个头信息来决定是否返回webp图片了。

**缺点如下**

* 通过请求头检测，某些设备可能不太准
* 图片静态资源都会放到CDN服务器上，那么在这个层面加上判断webp的逻辑就有点麻烦了

#### 2. 前端检测

通过特性检查可以知道用户的浏览器是否支持webp，坏处就是需要在业务代码中加入检测webp的逻辑。

**方案**

通常做法是在页面加载前先执行一段webp的检测，得出浏览器是否支持webp格式，把结果存入cookie中，在加载图片时，如果是懒加载的图片，那么根据是否支持webp来处理图片路径就好，如果不是懒加载的图片，可以在后端渲染模板时，根据我们设置好的是否支持webp的cookie来判断。

该方案是针对页面通过img标签引入图片时兼容webp的方式。

如果是css中引入的图片，方案一般就是构建两套css，然后在后端模板中根据cookie判断使用哪一套，或是在css中通过选择器覆盖，比如对于支持webp的浏览器，我们在html根节点上加上webps的类名，然后针对引入的图片。

#### 方案3 实际方案

**场景1**

针对img标签引入的图片，由于图片使用的是懒加载，那么可以，直接修改我们的懒加载插件就可以实现，在替换真实图片路径的时候判断一下是否支持webp，然后替换相应的路径就可以。
 
**场景2**
 
针对css引入的图片，可以采取的方案是利用css的优先级覆盖，比如说如果浏览器支持webp，那么可以给html根节点上加上webps的类名。

**存在的问题**

1. 每次写代码的时候加上.webps工作量比较大

2. 每张图对应的webp图片如何生成

**解决方案**

1. 使用 css 预处理器来解决
2. 使用 Nodejs 来监控图片文件夹，当图片增加、修改、删除时，它便会生成或删除对应的webp图片。

##### 检测webp的方法

```
;(function (doc) {
    // 给html根节点加上webps类名

    function addRootTag() {
        doc.documentElement.className += " webps";
    }

    // 判断是否有webps=A这个cookie
    if (!/(^|;\s?)webps=A/.test(document.cookie)) {
        var image = new Image();

        // 一张支持alpha透明度的webp的图片，使用base64编码， 宽度是1
        image.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==';

        // 图片加载完成时候的操作
        image.onload = function () {
            // 因为这张base64图是webp格式。如果不支持会触发image.error方法
            if (image.width == 1) {
                // html根节点添加class，并且埋入cookie
                addRootTag();
                document.cookie = "webps=A; max-age=31536000; domain=58.com";
            }
        };

    } else {
        addRootTag();
    }
}(document));

```

#### node 检测

```
/**
 * 运行：npm install && npm start
 * 程序依赖谷歌官方webp转换工具cwebp
 * mac下安装 brew install webp
 * windows下可以去google官方下载
 * 安装完成后运行cwebp -h 如果显示了使用帮助则表示安装成功
 */

const process = require('child_process');
const fs = require('fs');
const chokidar = require('chokidar');

const log = console.log.bind(console);
const ignoreFiles = /(^\..+)|(.+[\/\\]\..+)|(.+?\.webp$)/; // 忽略文件.开头和.webp结尾的

let quality = 75; // webp图片质量，默认75
let imgDir = 'images'; // 默认图片文件夹

// 得到对应的webp格式的文件名，默认为文件名后加上.webp
function getWebpImgName(path) {
    return `${path}.webp`;
}

// 得到shell命令
function getShellCmd(path) {
    return `cwebp -q ${quality} ${path} -o ${getWebpImgName(path)}`;
}

// 监控文件夹
var watcher = chokidar.watch(imgDir, {
    ignored: path => {
        return ignoreFiles.test(path);
    },
    persistent: true // 保持监听状态
});

// 监听增加，修改，删除文件的事件
watcher.on('all', (event, path) => {
    switch (event) {
        case 'add':
        case 'change':
            generateWebpImg(path, (status) => {
                log('生成图片' + getWebpImgName(path) + status);
            });
            break;
        case 'unlink':
            deleteWebpImg(getWebpImgName(path), (status) => {
                log('删除图片' + getWebpImgName(path) + status);
            });
            break;
        default:
            break;
    }
});

log('biubiubiu~~~ 监控已经启动');

function generateWebpImg(path, cb) {
    process.exec(getShellCmd(path), err => {
        if (err !== null) {
            cb('失败');
            log('请先运行cwebp -h命令检查cwebp是否安装ok。')
            log(err);
        } else {
            cb('成功');
        }
    });
}

function deleteWebpImg(path, cb) {
    fs.unlink(path, (err) => {
        if (err) {
            cb('失败');
            log(err)
        } else {
            cb('成功');
        };
    });
}
```

#### 参考链接

* [github](https://github.com/huangjiaxing/webp-monitor)
* [文章链接](http://www.cnblogs.com/season-huang/p/5804884.html)






