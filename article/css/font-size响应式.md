## font-size 响应式

### 思路

1. 制定一个最大的和最小的屏幕宽度值，我们的 ``` font-size ``` 应该是在这个屏幕范围内平滑均匀的变化
2. 制定最大和最小的 ``` font-size ```，屏幕大小小于最小的屏幕宽度值的时候，应用最小的 ``` font-size ```，反之，应用最大的 ``` font-size ```

### 相关技术

* @media：CSS Level 3 提供的媒体查询
* vw：Viewport 单位，1vw 相当于屏幕宽度的百分之一
* calc：这是 CSS 提供的一个非常强大的属性，可以用来动态计算 CSS 的值

### 代码

#### HTML

```
<header>
    <h2>This is Header.</h2>
</header>
<section>
    <article>
   		font-size
    </article>
</section>
```

#### CSS

```
$min-font-size: 1.4rem;
$max-font-size: 1.8rem;
$min-screen: 600px;
$max-screen: 1200px;

:root {
    font-size: 10px;
}

article {
    font-size: $min-font-size;
}

@media (min-width: $min-screen) and (max-width: $max-screen) {
    article {
        font-size: calc($min-font-size + (1.8 - 1.4) * ((100vw - $min-screen) / (1200 - 600)));
    }
}

@media (min-width: $max-screen) {
    article {
        font-size: $max-font-size;
    }
}

```

### 其他方案
* rem

### vw[css3]

相对于视口的宽度。视口被均分为100单位的vw。

```
h1 {
	font-size: 8vw;
}
```

如果视口的宽度是200mm，那么上述代码中h1元素的字号将为16mm，即(8x200)/100。