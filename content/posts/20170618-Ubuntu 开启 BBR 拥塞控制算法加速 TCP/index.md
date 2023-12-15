+++
title = "Ubuntu 开启 BBR 拥塞控制算法加速 TCP"
description = "Ubuntu 开启 BBR 拥塞控制算法加速 TCP"
tags = ["VPS","Ubuntu"]
date = "2017-06-18 00:36:04"
lastmod = '2017-06-18'
categories = ["乱七八糟"]
slug = "ubuntu-bbr"
lightgallery = true
+++

## 系统更新

~~昨天~~ 前天（打字的时候过 0 点了）买的搬瓦工 VPS，默认系统是 CentOS 6.8，后台重装先换成 Ubuntu 16.04，为什么？我懒啊，图方便。

然后 `root` 登录，终端输入：

```
apt-get update				#更新软件列表
apt-get upgrade				#升级软件
apt-get dist-upgrade			#升级当前系统版本
do-release-upgrade -d			#升级到新的系统版本
```

一路输入 `Y` ，结束后 `reboot` 。

## 安装最新内核并开启 BBR 脚本

接上面，重新连接后：

```
uname -a
```

```
返回：Linux eva00 4.4.0-62-generic #83-Ubuntu SMP Wed Jan 18 14:10:15 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux
```

内核 4.4.0，开启 BBR 貌似需要 4.9 以上吧，需要更新内核。

## 什么是 BBR？

> TCP BBR 是 Google 出品的 TCP 拥塞控制算法。BBR 目的是要尽量跑满带宽，并且尽量不要有排队的情况。BBR 可以起到单边加速 TCP 连接的效果。

用的还是秋大的 [一键安装最新内核并开启 BBR 脚本](https://teddysun.com/489.html)：

```
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh
chmod +x bbr.sh
./bbr.sh
```
完成后按 `Y` 重启。

重新连接后继续：

```
uname -a
```

返回：**Linux ubuntu 4.11.6-041106-generic #201706170517 SMP Sat Jun 17 09:18:46 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux **则升级成功。

```
sysctl net.ipv4.tcp_available_congestion_control
```

返回值一般为： **net.ipv4.tcp_available_congestion_control = bbr cubic reno**

```
sysctl net.ipv4.tcp_congestion_control
```

返回值一般为： **net.ipv4.tcp_congestion_control = bbr**

```
sysctl net.core.default_qdisc
```

返回值一般为：**net.core.default_qdisc = fq**

```
lsmod | grep bbr
```

出现 `tcp_bbr` 字样，至此开启 BBR 成功。

## 简单测试

还没有安装 SSR ，待更新。

@update 2017.7.1 终于抽空装了 SSR，非高峰期，有土鳖 1080P 下，大概就是这个速度，1080P 勉强，有时候要缓冲，720P 没什么问题。

截图来至 [和楽器バンド / 「起死回生」6/21発売「和楽器バンド大新年会2017](https://www.youtube.com/watch?v=h8Q85IpwCP4&list=RD6lp4Iw1AbgA&index=2) 

蜷川べに （津軽三味線）

![ssr-cs](ssr-cs.gif "ssr-cs")

晚上有点不太满意，搜索了下，发现论坛好多人用的魔改版，试一下，用的是这个一键包：[Debian/Ubuntu TCP BBR 改进版/增强版](https://moeclub.org/2017/06/24/278/)，貌似只支持 **Debian8 / Ubuntu16 +**。

```
wget --no-check-certificate -qO 'BBR.sh' 'https://moeclub.org/attachment/LinuxShell/BBR.sh' && chmod a+x BBR.sh && bash BBR.sh -f
```

完成后运行：

```
lsmod |grep 'bbr_powered'
```

返回 `bbr_powered'` 字样，则安装成功了。