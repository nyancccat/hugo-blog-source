# 使用 gulp 压缩 hexo 静态资源


## 前言

前两天把博客托管到 Coding，相比以前放在 Github 访问速度有了不错的提升。

今天休息没事，想着再优化下，查看页面源码发现代码未压缩，于是到 Hexo 插件库看了下，找到个 [hexo-all-minifier ](https://github.com/unhealthy/hexo-all-minifier)，但是我安装下来一直报错，搜索过程中找到基于 gulp 的几个压缩插件，马上试试。

## 关于 gulp

&gt;gulp 的官方定义非常简洁：基于文件流的构建系统。


&gt;**#说人话系列#**：gulp 是前端开发过程中对代码进行构建的工具，是自动化项目的构建利器；她不仅能对网站资源进行优化，而且在开发过程中很多重复的任务能够使用正确的工具自动完成。



## 安装 gulp 及相关插件

主要安装以下几个：

- 基本：[gulp](https://www.npmjs.com/package/gulp)
- CSS 压缩：[gulp-clean-css](https://github.com/scniro/gulp-clean-css) （原名 gulp-minify-css）
- JS 压缩：[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
- HTML 压缩：[gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin) ,  [gulp-htmlclean](https://www.npmjs.com/package/gulp-htmlclean)
- 图片压缩：[gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)

```bash
npm install gulp -g
npm install gulp-clean-css gulp-uglify gulp-htmlmin gulp-imagemin gulp-htmlclean gulp --save
```

安装完成后打开 `hexo` 目录下的 `package.json` 文件，查看是否安装了上述插件，比如我的：

```
{
  &#34;name&#34;: &#34;hexo-site&#34;,
  &#34;version&#34;: &#34;0.0.0&#34;,
  &#34;private&#34;: true,
  &#34;hexo&#34;: {
    &#34;version&#34;: &#34;3.2.0&#34;
  },
  &#34;dependencies&#34;: {
    &#34;gulp&#34;: &#34;^3.9.1&#34;,
    &#34;gulp-clean-css&#34;: &#34;^2.0.11&#34;,
    &#34;gulp-htmlclean&#34;: &#34;^2.7.6&#34;,
    &#34;gulp-htmlmin&#34;: &#34;^2.0.0&#34;,
    &#34;gulp-imagemin&#34;: &#34;^3.0.1&#34;,
    &#34;gulp-uglify&#34;: &#34;^1.5.4&#34;,
    &#34;hexo&#34;: &#34;^3.2.0&#34;,
    &#34;hexo-deployer-git&#34;: &#34;^0.1.0&#34;,
    &#34;hexo-generator-archive&#34;: &#34;^0.1.4&#34;,
    &#34;hexo-generator-category&#34;: &#34;^0.1.3&#34;,
    &#34;hexo-generator-index&#34;: &#34;^0.2.0&#34;,
    &#34;hexo-generator-tag&#34;: &#34;^0.2.0&#34;,
    &#34;hexo-renderer-ejs&#34;: &#34;^0.2.0&#34;,
    &#34;hexo-renderer-marked&#34;: &#34;^0.2.10&#34;,
    &#34;hexo-renderer-stylus&#34;: &#34;^0.3.1&#34;,
    &#34;hexo-server&#34;: &#34;^0.2.0&#34;
  }
}
```

## 编写 gulpfile.js

`hexo` 同级目录下新建文件 `gulpfile.js`，编辑内容如下，适当修改路径。

比如图片等附件我一直沿用以前使用 WordPress 留下来的 `uploads` 目录。

其余的插件设置已经在注释中，所有使用说明来自 [一点](http://www.ydcss.com/archives/category/%E6%9E%84%E5%BB%BA%E5%B7%A5%E5%85%B7) 博客的构建工具分类下文章。

```javascript
var gulp = require(&#39;gulp&#39;);
    minifycss = require(&#39;gulp-clean-css&#39;);
    uglify = require(&#39;gulp-uglify&#39;);
    htmlmin = require(&#39;gulp-htmlmin&#39;);
    htmlclean = require(&#39;gulp-htmlclean&#39;);
    imagemin = require(&#39;gulp-imagemin&#39;);

// 压缩 public 目录内 css
gulp.task(&#39;minify-css&#39;, function() {
    return gulp.src(&#39;./public/**/*.css&#39;)
        .pipe(minifycss({
           advanced: true,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
           compatibility: &#39;ie7&#39;,//保留ie7及以下兼容写法 类型：String 默认：&#39;&#39;or&#39;*&#39; [启用兼容模式； &#39;ie7&#39;：IE7兼容模式，&#39;ie8&#39;：IE8兼容模式，&#39;*&#39;：IE9&#43;兼容模式]
           keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
           keepSpecialComments: &#39;*&#39;
           //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest(&#39;./public&#39;));
});

// 压缩 public 目录内 html
gulp.task(&#39;minify-html&#39;, function() {
  return gulp.src(&#39;./public/**/*.html&#39;)
    .pipe(htmlclean())
    .pipe(htmlmin({
        removeComments: true,//清除 HTML 注释
        collapseWhitespace: true,//压缩 HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 &lt;input checked=&#34;true&#34;/&gt; ==&gt; &lt;input /&gt;
        removeEmptyAttributes: true,//删除所有空格作属性值 &lt;input id=&#34;&#34; /&gt; ==&gt; &lt;input /&gt;
        removeScriptTypeAttributes: true,//删除 &lt;script&gt; 的 type=&#34;text/javascript&#34;
        removeStyleLinkTypeAttributes: true,//删除 &lt;style&gt; 和 &lt;link&gt; 的 type=&#34;text/css&#34;
        minifyJS: true,//压缩页面 JS
        minifyCSS: true//压缩页面 CSS
    }))
    .pipe(gulp.dest(&#39;./public&#39;))
});

// 压缩 public/js 目录内 js
gulp.task(&#39;minify-js&#39;, function() {
    return gulp.src(&#39;./public/**/*.js&#39;)
        .pipe(uglify())
        .pipe(gulp.dest(&#39;./public&#39;));
});

// 压缩 public/uploads 目录内图片
gulp.task(&#39;minify-images&#39;, function() {
    gulp.src(&#39;./public/uploads/**/*.*&#39;)
        .pipe(imagemin({
           optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
           progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
           interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
           multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(&#39;./public/uploads&#39;));
});

// 执行 gulp 命令时执行的任务
gulp.task(&#39;default&#39;, [
    &#39;minify-html&#39;,&#39;minify-css&#39;,&#39;minify-js&#39;,&#39;minify-images&#39;
]);
```

## 命令执行

```bash
hexo clean
hexo g &amp;&amp; gulp
```

![gulp 执行压缩](gulp.png &#34;执行过程&#34;)


## 效果比对

截取了整个 public 目录 压缩前后大小变化图：

![压缩前](ysq.png &#34;压缩前&#34;)
![压缩后](ysh.png &#34;压缩后&#34;)

貌似压缩得让我不够满意，还是我哪里没弄好。

不管了，先部署上去看看。

```bash
hexo d
```
以后生成、压缩、部署也可以连起来。

```bash
hexo g &amp;&amp; gulp &amp;&amp; hexo d
```

完成后查看页面源码，整个页面代码都压缩了，实际打开感觉也是比以前快了点。

## 待更新

先到这里，以后再翻翻资料。


---

> 作者: [pagezen](http://clearsky.me/)  
> URL: https://clearsky.me/hexo-gulp-compres/  

