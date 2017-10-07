## CSS 功能查询

#### 概述

@support 就是功能查询。
 
通过 @support，你可以在 CSS 中使用一小段的测试来查看浏览器是否支持一个特定的 CSS 功能(这个功能可以是 CSS 的某种属性或者某个属性的某个值)，然后，根据测试的结果来决定是否要应用某段样式。

```
@supports ( display: grid ) {
    // 如果浏览器支持 Grid，这里面的代码才会执行
}
```

什么时候才需要使用 @supports 呢？功能查询是将 CSS 声明绑定在一起的一个工具，以便于这些 CSS 规则能够在某种条件下以一个组合的方式运行。当你需要混合使用 CSS 的新规则和旧规则的时候，并且，仅当 CSS 新功能被支持的时候，就可以使用功能查询了。


#### 浏览器支持情况

![图片](https://segmentfault.com/image?src=https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2016/08/Can-I-Use-Feature-Queries.gif&objectId=1190000006734430&token=55799b625be89c4ec2afd5a4ef6f3bd2)

#### 代码

```
@supports (initial-letter: 4) or (-webkit-initial-letter: 4) {
    p::first-letter {
        -webkit-initial-letter: 4;
        initial-letter: 4;
        color: #FE742F;
        font-weight: bold;
        margin-right: 0.5em;
    }
}

```

