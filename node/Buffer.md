## Buffer

### Buffer 结构，但它主要用于操作字节

#### 1. 模块结构

Buffer 是一个典型的JavaScript与C++结合的模块，它将性能相关的部分用C++实现，将非性能相关的部分有JavaScript实现。

Buffer 所占用的内存不是通过V8分配的，属于堆外内存。由于V8垃圾回收性能的影响，将常用的操作对象用更高效和专有的内存分配回收策略来管理是个不错的思路。

由于Buffer太过于常用，Node进程启动时就已经加载，并将其放入全局对象上，所以在使用Buffer时，无须通过require()即可直接使用。

#### 2. Buffer 对象

Buffer 对象类似于数组，它的元素为16进制的两位数，即0到255的数值。

```
> var str = "深入浅出Node.js";
> var buf = new Buffer(str, 'utf-8')
> buf
<Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 4e 6f 64 65 2e 6a 73>
> buf.length
19
> buf[1]
183
```

不同编码的字符串占用的元素个数不同，中文字在 UTF-8 编码下占用3个元素，字母和半角标点符号占用1个元素。

Buffer 受 Array 的影响很大，可以访问length属性访问其长度，也可以通过下标来访问元素。

``` buf[20] = 12.3 ``` 给元素赋值如果小于0，就将该值加上256，直到得到0到255之间的一个整数；如果大于255，就减去256，直到得到0到255之间的一个整数；如果是小数，就舍去小数部分，只保留整数部分。

#### 3. Buffer 内存分配

为了高效地使用申请来的内存，Node 采用了 slab 分配机制，slab是一种动态内存管理机制。

简单而言，slab 就是一块申请好的固定大小的内存区域，slab 具有三种状态。

* full: 完全分配状态
* partial: 部分分配状态
* empty: 没有被分配状态

Node 以 8KB 为界限来区分 Bufer 是大块对象还是小对象。这个 8KB 的值也就是每个 slab的大小值。在 JavaScript 层面，以它作为单位单元进行内存的分配。

Buffer.poolSize = 8 * 1024

**分配小Buffer对象**

如果指定Buffer的大小少于8KB，Node会按小对象的方式进行分配。Buffer 的分配过程中主要使用一个局部变量 pool 作为中间处理对象，处于分配状态的 slab 单元都指向它。

当再次创建一个 Buffer 对象时，构造过程中将会判断这个 slab 的剩余空间是否足够，如果足够，使用剩余空间，并更新 slab 的分配状态。如果不够，将会构造新的 slab，原 slab 中剩余的空间会造成浪费。

由于同一个 slab 可能分配给多个 Buffer 对象使用，只有这些小 Buffer 对象在作用域释放并都可以回收时，slab 的 8KB 空间才会被回收。尽管创建 1 个字节的 Buffer 对象，如果不释放它，实际可能是 8KB 都没有得到释放。

**分配大Buffer对象**

如果需要超过 8KB 的 Buffer 对象，将会直接分配一个 SlowBuffer 对象作为 slab 单元，这个 slab 单元将会被这个大 Buffer 对象独占。


简单而言，真正的内存是在 Node 的 C++ 层面提供的，JavaScript 层面只是使用它。当进行小而频繁的 Buffer 操作时，采用 slab 的机制进行预先申请和事后分配，使得 JavaScript 到操作系统之间不必有过多的内存申请方面的系统调用。对于大块的 Buffer 而言，则直接使用 C++ 层面提供的内存，而无需细腻的分配操作。

### Buffer 的转换

#### 1. 字符串转 Buffer

字符串转 Buffer 对象主要是通过构造函数完成的。

new Buffer(str, [encoding])

通过构造函数转换的 Buffer 对象，存储的只能是一种编码类型。 encoding 参数不传递时，默认值为 utf-8。

一个Buffer对象可以存储不同编码类型的字符串转码的值，调用 write() 方法可以实现该目的。

buf.write(string, [offset], [length], [encoding])

#### 2. Buffer 转字符串

Buffer 对象的 toString() 可以将 Buffer 对象转换成为字符串

buf.toString([encoding], [str], [end])


#### 3. Buffer 不支持的编码类型

Buffer 提供了一个 isEncoding() 函数来判断是否支持转换

### Buffer 的拼接

```
var chunks = [];
var size = 0;
res.on('data', function (chunk) {
	chunks.push(chunk);
	size += chunk.length;
});

res.on('end', function () {
	var buf = Buffer.concat(chunk, size);
	var str = iconv.decode(buf, 'uft8');
	console.log(str)
})
```

正确的拼接方式是用一个数组来存储接收到所有 Buffer 片段并记录下所有片段的总长度，然后调用 Buffer.concat() 方法生成一个合并的 Buffer 对象。 Buffer.concat() 方法封装了从小 Buffer 对象向大 Buffer 对象的复制过程。

### Buffer 与性能

Buffer 在文件I/O和网络I/O中应用广泛，尤其在网络传输中，它的性能举足轻重。在应用中，通常会操作字符串，但一旦在网络中传输，都需要转换为 Buffer，以进行二进制数据传输。

通过预先转换到静态内容为 Buffer 对象，可以有效地减少 CPU 的重复使用，节省服务器资源。

在 Node 构建的 Web 应用中，可以选择将页面中的动态内容和静态内容分离，静态内容部分可以通过预先转换为 Buffer 的方法，使性能得到提升。由于文件自身是二进制数据，所以在不需要改变内容的场景下，尽量只读取 Buffer，然后直接传输，不做额外的转换，避免损耗。

#### 文件读取

Buffer 的使用除了与字符串的转换有性能损耗外，在文件的读取时，有一个 highWaterMark 设置对性能的影响至关重要。在 fs.createReadStream(path, opts)时，可以传入一些参数。

```
{
  flags: 'r',
  encoding: null,
  fd: null,
  mode: 0666,
  highWaterMark: 64 * 1024
}
```

fs.createReadStream() 的工作方式是在内存中准备一段 Buffer，然后在 fs.read() 读取时逐步从磁盘中将字节复制到 Buffer 中，完成一次读取时，则从这个 Buffer 中通过 slice() 方法取出部分数据作为一个小 Buffer 对象，再通过 data 事件传递给调用方。 如果 Buffer 用完，则重新分配一个。如果还有剩余，则继续使用。

理想的状况下，每次读取的长度就是用户指定的 highWaterMark。

读取一个相同的大文件时，highWaterMark 值得大小与读取速度的关系，值越大，读取速度越快。

### 总结

Buffer 是二进制数据，字符串与 Buffer 之间存在编码关系。不能随意的将 Buffer 当做字符串来使用。