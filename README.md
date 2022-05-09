# Genius Load 网页加载逻辑设置
![GeniusLoad](https://user-images.githubusercontent.com/75195784/167329901-e66ce99f-679b-4add-b28e-140e6d254cdf.jpg)

轻量且高效的网页外链（如：`JavaScript`、`CSS`等）加载逻辑设置工具，帮助您更加轻松地搭建自己的网页，避免出现因未加载完依赖项而出现 `Uncaught ReferenceError: XXX is not defined` 的错误。

本工具无依赖项，兼容包括IE7+及其他常见浏览器。总大小仅5KB。

## 基本用法

下载，并放置在您的网站中后引入

或者使用一些其他的CDN：

（这里留给 <www.staticfile.org> 求求收录了）

```html
<script src="https://cdn.jsdelivr.net/gh/HowardZhangdqs/geniusload@v1.2.3/geniusload.js"></script>
```
或者使用压缩后的：
```html
<script src="https://cdn.jsdelivr.net/gh/HowardZhangdqs/geniusload@v1.2.3/geniusload.min.js"></script>
```

**注意：如果需要使用geniusload加载的内容无需在网页代码中预先引入**

### 使用

**`v1.1.x` 新特性！**

`v1.1.x`中的`geniusload`使用方法如下：

```javascript
new geniusload(option);
```

该写法等价于`v1.0.x`中的

```
geniusload.loadTree(option);
```

**注意**：`v1.0.x`中的该写法在`v1.1.x`中已不再支持。

推荐的写法：

```html
<script>
    option = [...];
</script>
<script src="geniusload.js" onload="new geniusload(option);"></script>
```
不推荐的写法：
```html
<script src="geniusload.js"></script>
<script>
    window.onload = function() {
        new geniusload([...]);
    }
</script>
```

解释：前一种在加载完`geniusload`后会立即加载`option`，而后一种则需等到页面全部加载完毕后开始加载`option`。

### option配置项

`geniusload@v1.x`暂时仅支持加载`Array`格式的配置。

#### 嵌套加载加载单个外链

**格式**：

```javascript
[Tag, Para1, *Para2]
```

|   名称   |   类型   |                             含义                             |                           可填内容                           |
| :------: | :------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  `Tag`   | `string` | 规定外链的类型、`id`和`class`<br>`js`：`JavaScript`<br>`css`：层叠样式表<br>`font`：字体 | `js`、`css`、`font`三选一<br>（大小写不敏感）<br>`#id`和`.class`<br>（顺序不敏感） |
| `Para1`  | `string` | 若`Tag`不为`font`，则为规定外链的链接<br>若`Tag`为`font`，则为规定字体名 | 若`Tag`不为`font`，则为一个链接<br/>若`Tag`为`font`，则为规定字体名 |
| *`Para2` | `string` |                若`Tag`为`font`，则为字体链接                 |  若`Tag`为`font`，则为字体链接<br>若`Tag`不为`font`，则为空  |

**样例**:

1. 需要加载`jQuery`
```javascript
new geniusload(["js", "jquery.min.js"]);
```
2. 需要加载`font-awesome`，并且`class`为`sheets`
```javascript
new geniusload(["CSS.sheets", "font-awesome.css"]);
```
3. 需要加载`fontawesome-webfont.woff`，并且`class`为`woff`，`id`为`fontawesome`
```javascript
option = ["Font.woff#fontawesome", "Font Awesome 5 Free", "fontawesome-webfont.woff"];
new geniusload(option);
```

#### 同时加载多个外链

**格式**：

```javascript
[[option1], [option2], ...]
```

一个`Array`，`Array`中每一项格式同 [加载单个外链](#加载单个外链)

**含义**：

同时加载`Array`中的每一项配置

**样例**：

同时加载`font-awesome`以及其字体

```javascript
option = [
    ["CSS.sheets", "font-awesome.css"],
    ["Font.woff.font#Regular", "Font Awesome 5 Regular", "fa-regular-400.woff2"],
    ["Font.woff.font#Brands",  "Font Awesome 5 Brands",  "fa-brands-400.woff2"],
    ["Font.woff.font#Solid",   "Font Awesome 5 Solid",   "fa-solid-900.woff2"]
];
new geniusload(option);
```

#### 嵌套加载

嵌套加载为 [加载单个外链](#加载单个外链) 的进阶用法，继承 [加载单个外链](#加载单个外链) 的所有特性

**格式**：

```javascript
[Tag, Para1, *Para2, [option]]
```

**含义**：

前三项格式与含义同 [加载单个外链](#加载单个外链) 中的三项，第四项内格式与含义同 [加载单个外链](#加载单个外链) 和 [同时加载多个外链](#同时加载多个外链)

**样例**：

1. 加载`jQuery`后加载`jQuery UI`

```javascript
option = ["js", "jquery.min.js", ["js", "jquery-ui.custom.min.js"]];
new geniusload(option);
```

2. 加载`jQuery`后加载`ScrollMagic`、`Lazy Load`、`Chosen`
   同时加载`bootstrap.css`后加载`bootstrap.js`

```javascript
option = [
    ["js", "jquery.min.js", [
            ["js", "scrollmagic.min.js"],
            ["js", "lazyload.min.js"],
            ["js", "chosen.min.js"]
        ]
    ],
    ["css", "bootstrap.min.css", ["js", "bootstrap.min.js"]]
];
new geniusload(option);
```

#### 进阶配置项

进阶配置项加载为 [加载单个外链](#加载单个外链) 的进阶用法，继承 [加载单个外链](#加载单个外链) 的所有特性

**格式**：

```javascript
[Tag, Para1, *Para2, *[option], *afterload, *node_option]
```

**含义**：

后三项（`*[option]`、`*afterload`、`*node_option`）顺序任意，都为选填。

前四格式与含义同 [嵌套加载](#嵌套加载)。

|     名称      |    类型    |            含义            |      可填内容      |
| :-----------: | :--------: | :------------------------: | :----------------: |
|  `afterload`  | `function` | 该外链加载完毕后执行的函数 |      一个函数      |
| `node_option` |  `object`  |        该外链的配置        | 一个对象，详见下表 |

`node_option`可填内容：

```javascript
{
    type:       node_type,      
    id:         node_id,
    class:      node_class,
    beforeload: node_beforeload_function(),
    afterload:  node_afterload_function(),
    preload:    bool,
    fatherlist: [...]  // v1.2.x 新特性
}
```

**含义**：

|     名称     |    类型    |                       含义                        |
| :----------: | :--------: | :-----------------------------------------------: |
|    `type`    |  `string`  |    同 [加载单个外链](#加载单个外链) 中的`Tag`     |
|     `id`     |  `string`  |     同 [加载单个外链](#加载单个外链) 中的`id`     |
|   `class`    |  `string`  |   同 [加载单个外链](#加载单个外链) 中的`class`    |
| `beforeload` | `function` |           该外链开始加载之前执行的函数            |
| `afterload`  | `function` |            该外链加载完毕后执行的函数             |
|  `preload`   |   `bool`   |                 是否预加载该外链                  |
| `fatherlist` |  `array`   | 在加载完列表中指定的`class`或`id`的后再加载该外链 |

**注意**：如果同时声明`afterload`和`node_option`中的`afterload`，则后一次声明的项会覆盖前一次的声明。

**样例**：

加载`jQuery`，`class`为`js`，`id`为`jk`，开始加载时输出`"jQuery Start Loading"`，加载完毕后输出`"jQuery Loaded"`，再加载`ScrollMagic`、`Lazy Load`、`Chosen`，`class`为`dependency`最后加载`main.js`
```javascript
option = [
    ["js", "jquery.min.js", [
            ["js.dependency", "scrollmagic.min.js"],
            ["js.dependency", "lazyload.min.js"],
            ["js.dependency", "chosen.min.js"]
        ], function() {
            console.log("jQuery Loaded");
        }, {
            id: "jk",
            class: "js",
            beforeload: function() {
                console.log("jQuery Start Loading");
            }
        }
    ],
    ["js", "main.js", {fatherlist: [".dependency"]}]
];
new geniusload(option);
```

`console`控制台输出：

```html
jQuery Start Loading
[S XX:XX:XX.XXX GeniusLoad] <script class="js" id="jk" src="jquery.min.js" type="text/javascript"></script>
[E XX:XX:XX.XXX GeniusLoad] <script class="js" id="jk" src="jquery.min.js" type="text/javascript"></script> which loaded for XX ms
jQuery Loaded
[S XX:XX:XX.XXX GeniusLoad] <script class="dependency" src="scrollmagic.min.js" type="text/javascript"></script>
[S XX:XX:XX.XXX GeniusLoad] <script class="dependency" src="lazyload.min.js" type="text/javascript"></script>
[S XX:XX:XX.XXX GeniusLoad] <script class="dependency" src="chosen.min.js" type="text/javascript"></script>
[E XX:XX:XX.XXX GeniusLoad] <script class="dependency" src="scrollmagic.min.js" type="text/javascript"></script> which loaded for XX ms
[E XX:XX:XX.XXX GeniusLoad] <script class="dependency" src="lazyload.min.js" type="text/javascript"></script> which loaded for XX ms
[E XX:XX:XX.XXX GeniusLoad] <script class="dependency" src="chosen.min.js" type="text/javascript"></script> which loaded for XX ms
[S XX:XX:XX.XXX GeniusLoad] <script src="main.js" type="text/javascript"></script>
[E XX:XX:XX.XXX GeniusLoad] <script src="main.js" type="text/javascript"></script> which loaded for XX ms
```

### 其他用法

关闭`console`控制台输出

```javascript
let geniusme = new geniusload();
geniusme.consolelog = function() {};
geniusme.loadTree([option]); // 在geniusme.loadTree()函数中放入加载项
```

## 新特性

`v1.2.x`使用`new`方法调用，方便使用。

`v1.2.x`自动外链预加载，加快调用速度，并且不会扰乱加载顺序。

# License

All code licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php). In other words you are basically free to do whatever you want. Just don't remove my name from the source.
