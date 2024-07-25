+++
title = "Hexo 使用 APlayer 插入音乐"
description = "Hexo 使用 APlayer 插入音乐"
tags = ["Hexo"]
date = "2017-08-23 22:36:04"
lastmod = "2018-03-28"
categories = ["乱七八糟"]
slug = "hexo-aplayer"
+++

## 来源

刚开始一直用网易云音乐官方外链播放器 iframe 方法给文章插入音乐，后来嫌不支持 https 就换成网上找到的一个外链接口，用着还可以，最近几个月一直没怎么给文章添加音乐，所以也不太关注。今天用到了才发现接口已经挂掉了，所以网上搜了一下，找到这个新方法。

方法来自 [萨摩公园](https://i-meto.com/) 的文章 「 [让 Ghost 吃上 APlayer](https://i-meto.com/ghost-aplayer/) ］

原文是用在 Ghost 上的，看了下是加载两个 js，所以用在 Hexo 上也没什么问题。

## 加载相关 JS 文件

我用的是 next 主题，编辑 `/themes/next/layout/_partials/` 目录下的 `header.swig`，引入 Aplayer.js

2018.3.28更新：添加如下代码：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer@1.7.0/dist/APlayer.min.css">
```

```javascript
<script src="https://cdn.jsdelivr.net/npm/aplayer@1.7.0/dist/APlayer.min.js"></script>
```

继续编辑同目录下的 `footer.swig`，引入 aplayer.js


2018.3.28更新：添加如下代码：

```javascript
<script src="https://cdn.jsdelivr.net/npm/meting@1.1.0/dist/Meting.min.js"></script>
```
当然也可以把 js 文件保存下来，自行引入地址，至此完成！

## 文章中使用

在文章中想要添加歌曲的位置使用如下代码：

```html
<div class="aplayer" data-id="22773511" data-server="netease" data-type="song" data-mode="single"></div>
```

上面的效果如下：

<div class="aplayer" data-id="22773511" data-server="netease" data-type="song" data-mode="single"></div>

## 常用参数

| 主要参数          |                    值                     |
| :------------ | :--------------------------------------: |
| data-id       |               歌曲/专辑/歌单 ID                |
| data-server   | netease（网易云音乐）tencent（QQ音乐）  xiami（虾米）  kugou（酷狗） |
| data-type     | song （单曲）  album （专辑）  playlist （歌单）  search （搜索） |
| data-mode     | random （随机）  single （单曲）  circulation （列表循环）  order （列表） |
| data-autoplay |         false（手动播放）  true（自动播放）          |

更多参数：

https://aplayer.js.org/docs/#/?id=options

## 结束

最近在整理后摇歌单，扔个歌单，我的网易云音乐账号[@u0defined](http://music.163.com/#/user/home?id=64357308)，欢迎交流。

{{< music auto="https://music.163.com/#/playlist?id=864701453" >}}