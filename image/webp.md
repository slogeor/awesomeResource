## WebP 与 PNG

### 简介

WebP 是一种支持有损压缩和无损压缩的图片文件格式，派生自图像编码格式 VP8。根据 Google 的测试，无损压缩后的 WebP 比 PNG 文件少了 45％ 的文件大小，即使这些 PNG 文件经过其他压缩工具压缩之后，WebP 还是可以减少 28％ 的文件大小。

### 简单测试

![检测](https://isux.tencent.com/wp-content/uploads/2014/12/20141212164211465.png)

**结论**

* PNG 转 WebP 的压缩率要高于 PNG 原图压缩率，同样支持有损与无损压缩
* 转换后的 WebP 体积大幅减少，图片质量也得到保障（同时肉眼几乎无法看出差异）
* 转换后的 WebP 支持 Alpha 透明和 24-bit 颜色数，不存在 PNG8 色彩不够丰富和在浏览器中可能会出现毛边的问题

### webp 和 png 对比

* 解码耗时：WebP 的解码时间是 PNG 的 5 倍 左右（64.1ms）
* 流畅程度：WebP 的 FPS 平均值会比 PNG 的平均值要小，但是比较稳定，跨度不大，性能也相差不大
* CPU使用：总体上看，PNG 格式的表情使用 CPU 波动比较大。从平均值来看 WebP 格式表情占用的 CPU 会比 PNG 表情的占用率大
* 内存占用：WebP 格式表情，占用内存的跨度为 4M，波动比较明显。PNG 格式表情，占用内存的跨度为 5M，没有明显波动。停止发送表情后，40s 左右内存均有回降

### 实践数据

科技博客 GigaOM 曾报道：YouTube 的视频略缩图采用 WebP 格式后，网页加载速度提升了 10%；谷歌的 Chrome 网上应用商店采用 WebP 格式图片后，每天可以节省几 TB 的带宽，页面平均加载时间大约减少 1/3；Google+ 移动应用采用 WebP 图片格式后，每天节省了 50TB 数据存储空间

### 相关链接

* [https://developers.google.com/speed/webp/](https://developers.google.com/speed/webp/)
* [图片压缩对比效果](https://isparta.github.io/compare-webp/index.html#45123)
* [转换工具](http://isparta.github.io/)
* [原文链接](http://isux.tencent.com/introduction-of-webp.html)