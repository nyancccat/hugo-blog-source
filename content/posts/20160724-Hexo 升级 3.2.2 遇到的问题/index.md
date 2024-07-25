+++
title = "Hexo 升级 3.2.2 遇到的问题"
description = "Hexo 升级 3.2.2 遇到的问题"
tags = ["Hexo"]
date = "2016-07-24 11:33:38"
lastmod = '2016-07-24'
categories = ["乱七八糟"]
slug = "hexo-upgrade-to-3.2.2"
lightgallery = true
+++

## 蛋疼

悲剧值班的周末，翻了下 Hexo 官方，看到许多人都升级到 v3.2.2 了，虽然明知道每次升级都很坑，但是值班本来也无聊，于是折腾开始了。

## 开始

鉴于以前每次升级都很蛋疼，这次学聪明了，先备份。我是直打包整个 Hexo 目录扔到其他盘。

说是升级，其实相当于全新安装了，新建 Hexo 目录，目录内 Git Bash here ，官方步骤：

```bash
npm install hexo-cli -g
hexo init 
npm install
```

完成后，把原来的 `source` 目录拷贝进来，迁移数据。

`_config.yml` 不建议用原来的，以前的 Hexo 版本很多插件配置都是放在这里的，现在改了，直接用容易出错。我是怕了，所有配置都重新来了一遍，包括插件。

然后试一下。

```bash
hexo g && hexo s
```

```
INFO  Start processing
INFO  Hexo is running at http://localhost:4000/. Press Ctrl+C to stop.INFO  Start processing
```

没报错，只出现几个 WARN ，按照关键字搜索了一下大致是我的 node.js 版本高了，我用的 6.3.1，建议换成 5.x，避免不必要的麻烦。

## hexo sever 端口占用

本来打算调试下直接部署，浏览器打开 localhost:4000，死活打不开，一直缓冲中。

尝试换个端口:

```bash
hexo s -p 4444
```

```
INFO  Start processing
INFO  Hexo is running at http://localhost:4444/. Press Ctrl+C to stop.
```

再刷新就没问题了，看来是端口被占用了。


看看是什么在占用，Windows 下：

```
netstat -aon|findstr "4000"
```

LISTENING 后面的数字是 `pid`

```
tasklist|findstr "pid"
```

一个 `FoxitProtect.exe` 在占用，是前几天装的的 福昕PDF阅读器，直接卸载掉。

## 更新主题

没什么说的，用的还是 Next 主题 ，顺带一起更新为最新版了，然后又花了点时间把以前修改过的地方一点一点改过来。

## gulp-imagemin 插件问题

前两天用了 [gulp 压缩 hexo 静态资源](https://clearsky.me/hexo-gulp-compress.html) ，Hexo 更新后报错：

```
events.js:141
      throw er; // Unhandled 'error' event
      ^
```

我翻了好久才确定不是更新 Hexo 的原因，而是 gulp-imagemin 这个插件自己这两天也更新了一个版本 `3.0.2`，我当前环境一更新到这个版本就出错，原因不明，只能安装前几天还正常运行的版本 `3.0.1`。

```bash
npm install gulp-imagemin@3.0.1 --save
```

## rss 页面报错

用 hexo-generator-feed 生成的 atom.xml 报错:

```
This page contains the following errors:

error on line xxx at column xxx: Input is not proper UTF-8, indicate encoding !
Bytes: 0xE5 0x89 0x8D 0xE8
Below is a rendering of the page up to the first error.
```

搜索了下 大致是 rss 页面含有隐藏的字符，或者由于 CDATA 的结束符号是“]]>”，所以CDATA中不能包含“]]>”，由于 CDATA 中的所有标记、实体引用都被忽略，所以 CDATA 不能嵌套使用等原因，懒得搞了，先禁止掉。

## 总结

由于 npm 坑爹的速度和杂七杂八的小问题，使得每次更新都花费大半天的时间，下次不手贱了，能用就行。







