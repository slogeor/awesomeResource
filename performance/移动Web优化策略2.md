### 目标

图片的加载给页面整体性能带来的影响以及优化策略。

### DOMContentLoaded

浏览器的 DOMContentLoaded 事件会在主页面加载并解析完成之后触发，不会等页面样式、图片、iframe 等子资源加载完

### 方案

1. 控制图片大小
2. 控制图片加载

### 控制图片大小

1. 根据 DPR(设备像素比) 选择合适的图片尺寸
2. 处理好响应式图片
3. 使用 WEBP 格式

#### 处理好响应式图片

移动设备宽度各式各样，如果裁图规格太多，容易降低 CDN 缓存命中率。

图床实时处理完图片再分发到 CDN 更耗时，在移动端让图片命中 CDN 缓存也很重要。

处理响应式图片的最佳实践是根据用户屏幕尺寸分布，制定出几档裁图规则，页面根据用户设备宽度使用最合适的档位，并对重要的图片（例如头部焦点图）提前预热 CDN。

#### 使用 WEBP 格式

检测代码

```
var webpImg = new Image;
webpImg.onload = function () {
    if(webpImg.width == 1){
        cookie('env_webp', 1);
    }
};
webpImg.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAgA0JaQAA3AA/vv9UAA=';

```

### 控制图片加载

在移动浏览器打开网页，经常能感觉到明显的卡顿。造成卡顿的原因除了页面 DOM 结构复杂、CSS 过多地触发 Layout/Paint/Composite、存在复杂 JS 逻辑等等，也可能是没有控制图片的加载时机。

1. 按需加载图片
2. 顺序加载图片
3. 不要在页面滚动时加载图片


#### 顺序加载图片

在移动端，人为控制图片加载顺序，例如从上到下，从左到右加载，有时可以带来更好地体验

#### 不要在页面滚动时加载图片

在移动端滚动页面本来就很耗费性能，如果这时候还要加载图片，非常容易造成页面卡顿。在页面滚定停止之后才开始载入图片，能有效减少这种卡顿。

### 原文

[移动 WEB 通用优化策略介绍（二）](https://imququ.com/post/wpo-of-mobile-web-2.html#simple_thread)