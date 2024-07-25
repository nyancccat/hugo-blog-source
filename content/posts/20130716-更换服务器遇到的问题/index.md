+++
title = "更换服务器遇到的问题"
description = "更换服务器遇到的问题"
tags = ["虚拟主机"]
date = "2013-07-16 01:29:21"
lastmod = '2013-07-16'
categories = ["学习备忘"]
slug = "blog-moving-problem"
toc = false
+++

收到邮件，所在虚拟主机所在的台湾的服务器故障了，迁移到香港服务器。

域名解析A到新的ip后能访问了，不过有点小问题，一是后台编辑时高级选项和附件不能展开。

在原来的服务器是没有问题的，试着弄了一下搞不定，试着WHMCS后台发了个技术支持工单，主机商效率不错，十多分钟就给我答案了，原因是所用插件MagikeEditor编辑器和所换到的当前环境小冲突，具体原因不明，只好暂时暂停该插件了。呵呵，所以说，访问量不大的博客还是用虚拟主机舒服，不用折腾。

还有个小问题，一些页面出现Notice: Undefined variable报错，这个是php配置问题，我以前遇到过，大概是换到新服务器还没全部配置好吧，不过这个问题不大，只是把警告在页面上打印出来，看起来不舒服，修改php.in配置就能解决，顺手google下记录一下:

ps:我在虚拟主机后台面板没有找到修改PHP配置的地方，我记得有些面板是可以直接改的，或者是被禁止了。不过懒得提交技术工单了，能自己解决的我也不麻烦人家。

两种方法：不能修改php.in，所以我用的第二种。

**第一种：修改php.in**


{{< admonition tip >}}
1. error_reporting设置：

找到`error_reporting = E_ALL`

修改为`error_reporting = E_ALL & ~E_NOTICE`

2. register_globals设置：

找到`register_globals = Off`

修改为`register_globals = On`
{{< /admonition >}}

**第二种：php代码添加**

因为不止是单个页面出现这种警告，所以我把代码加在`header.php`，通杀。

```php
ini_set("error_reporting","E_ALL & ~E_NOTICE");
```
刷新页面，解决了。
