+++
title = "精简了一下vps系统"
description = "精简了一下vps系统"
tags = ["VPS"]
date = "2013-01-16 11:03:20"
lastmod = '2013-01-16'
categories = ["学习备忘"]
slug = "debian-lite"
lightgallery = true
toc = false
+++

现在用的这个vps性能太挫，前段时间从contos换到debian，据说debian能省点内存。

其实省不省内存我无所谓，本来就是拿来用的，留着也不能当饭吃。可是有时点开探针看着内存占用快爆了，实在受不了。
没钱上好的vps只能精简系统了，google一下，debian下精简的都差不多是同一篇文章，不知道哪里是原出处了。

人懒，不求原理，只求效果，记一下：

**升级系统：**

```bash
apt-get update&&apt-get upgrade
```

**删除完全多余的软件：**

```bash
apt-get -y purge apache2-* bind9-* xinetd samba-* nscd-* portmap sendmail-* sasl2-bin
```

sendmail我留着了，没删。

**删除多余的系统组件：**

```bash
apt-get -y purge apache2-* bind9-* xinetd samba-* nscd-* portmap sendmail-* sasl2-bin`
```

**事后清理：**

```bash
apt-get autoremove && apt-get clean
```

**完事后效果：**

![putty.jpg](2855228556.jpg "putty.jpg")
