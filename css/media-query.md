### 目标

利用 media 属性智能识别各种设备，并应用不同的 css

#### 方案1

用 HMTL 的 ``` <link> ``` 元素的 media 属性区分设备

```
<link rel="stylesheet" href="xxx.css"  media="screen and (max-device-width: 480px) and (orientation: portrait)">
```
* screen: 表示用于屏幕的设备 (无法用于打印机、3D眼睛、盲文阅读)
* max-device-width: 表示屏幕的最大宽度
* orientation: 区分竖屏(portrait)和横屏(landscape)

创建打印机设备的 css

```
<link rel="stylesheet"href=“xxx.css"media="print">
```

#### 方案2

在 CSS 中为不同设备定制指定的样式

```
@media screen and (min-device-width: 481px) {  
	// 屏宽大于480px的设备
	.xxid { margin-right: 200%; }
}
@media screen and (max-device-width: 480px) {  
	// 屏宽小于481px的设备
	.xxid { margin-right: 150%; }
}
@media print {	
	// 打印设备
}
```