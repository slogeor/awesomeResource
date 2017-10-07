## webpack


### webpack 简介

#### webpack 配置

* entry：js入口源文件
* output：生成文件
* module：进行字符串的处理
* resolve：文件路径的指向
* plugins：插件，比loader更强大，能使用更多webpack的api

#### 常用Plugins介绍

* 代码热替换, HotModuleReplacementPlugin
* 生成html文件，HtmlWebpackPlugin
* 将css成生文件，而非内联，ExtractTextPlugin
* 报错但不退出webpack进程，NoErrorsPlugin
* 代码丑化，UglifyJsPlugin，开发过程中不建议打开
* 多个 html共用一个js文件(chunk)，可用CommonsChunkPlugin
* 清理文件夹，Clean
* 调用模块的别名ProvidePlugin，例如想在js中用$，如果通过webpack加载，需要将$与jQuery对应起来

#### webpack 参数

* --colors 输出结果带彩色，比如：会用红色显示耗时较长的步骤
* --profile 输出性能数据，可以看到每一步的耗时
* --display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块

### webpack 优化

#### 1. 区分开发环境和生成环境

```
"scripts": {
    "publish-mac": "export NODE_ENV=prod&&webpack -p --progress --colors",
    "publish-win":  "set NODE_ENV=prod&&webpack -p --progress --colors"
}
```
#### 2. 使用代码热替换

使用代码热替换在开发的时候无需刷新页面即可看到更新。

##### 方案1

```
// 1. 修改 enrty入口文件js

entry: {
	index: [
		'webpack-dev-server/client?http://localhost:9000',
		'webpack/hot/only-dev-server',
		'./dist/index.min.js'
	]
}

// 2. 启动代码热替换 plugins

plugins: [
	new webpack.HotModuleReplacementPlugin()
]
```
##### 方案2

```
devServer: {
	port: 9000,
	contentBase: './dist/',
	historyApiFallback: true
}
```

#### import 导致文件过大

##### 方案1

配置 external
















#### 参考链接

[Webpack入门指谜](https://segmentfault.com/a/1190000002551952)

[Webpack-Demos](https://github.com/ruanyf/webpack-demos)

[webpack 优化](http://www.alloyteam.com/2016/01/webpack-use-optimization/)