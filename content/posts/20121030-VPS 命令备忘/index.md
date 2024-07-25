+++
title = "VPS 命令备忘"
description = "VPS 命令备忘"
tags = ["VPS"]
date = "2012-10-30 12:17:35"
lastmod = '2012-10-30'
categories = ["学习备忘"]
slug = "vps-memo"
+++

## 添加低权限ssh账号

```bash
useradd username -s /sbin/nologin
echo username:password | chpasswd`</pre>
```

## 调整时区

```bash
rm -rf /etc/localtime
ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

## 修改ssh端口

```bash
vi /etc/ssh/sshd_config
```
把端口22随意改，然后

```bash
service sshd restart
```

## 常用ssh命令，来自[vps侦探](http://www.vpser.net/build/linux-vps-ssh-command.html "http://www.vpser.net/build/linux-vps-ssh-command.html")

## 目录操作：

```bash
rm -rf mydir     /*删除mydir目录*/
mkdir dirname    /*创建名为dirname的目录*/
cd mydir        /*进入mydir目录*/
cd -           /*回上一级目录*/
cd ..          /*回父目录，中间有空格*/
cd ~          /*回根目录*/
mv tools tool /*把tools目录改名为tool */

ln -s tool bac /*给tool目录创建名为bac的符号链接,最熟悉的应该就是FTP中www链接到public_html目录了*/
cp -a tool /home/vpser/www /*把tool目录下所有文件复制到www目录下 */

```

## 文件操作：

```bash
rm go.tar        /* 删除go.tar文件 */
find mt.cgi      /* 查找文件名为mt.cgi的文件 */
df –h            /* 查看磁盘剩余空间,好像没这个必要，除非你太那个了 */
```

## 解压缩：

```bash
tar xvf wordpress.tar       /* 解压tar格式的文件 */
tar -tvf myfile.tar         /* 查看tar文件中包含的文件 */

tar cf toole.tar tool       /* 把tool目录打包为toole.tar文件 */

tar cfz vpser.tar.gz tool   
/* 把tool目录打包且压缩为vpser.tar.gz文件，因为.tar文件几乎是没有压缩过的，MT的.tar.gz文件解压成.tar文件后差不多是10MB */

tar jcvf  /var/bak/www.tar.bz2 /var/www/    /*创建.tar.bz2文件，压缩率高*/

tar xjf www.tar.bz2 /*解压tar.bz2格式*/

gzip -d ge.tar.gz   /* 解压.tar.gz文件为.tar文件 */

unzip phpbb.zip     /* 解压zip文件，windows下要压缩出一个.tar.gz格式的文件还是有点麻烦的 */
```

## 下载：

```bash
wget http://soft.vpser.net/web/nginx/nginx-0.8.0.tar.gz
/*下载远程服务器上的文件到自己的服务器，连上传都省了，服务器不是100M就是1000M的带宽，下载一个2-3兆的MT还不是几十秒的事 */

wget -c http://soft.vpser.net/web/nginx/nginx-0.8.0.tar.gz
/* 继续下载上次未下载完的文件 */

```

## 进程管理：

```bash
ps -aux   /*ps 进程状态查询命令*/

ps命令输出字段的含义：
[list]
[*]USER，进程所有者的用户名。
[*]PID，进程号，可以唯一标识该进程。
[*]%CPU，进程自最近一次刷新以来所占用的CPU时间和总时间的百分比。
[*]%MEM，进程使用内存的百分比。
[*]VSZ，进程使用的虚拟内存大小，以K为单位。
[*]RSS，进程占用的物理内存的总数量，以K为单位。
[*]TTY，进程相关的终端名。
[*]STAT，进程状态，用(R--运行或准备运行；S--睡眠状态；I--空闲；Z--冻结；D--不间断睡眠；W-进程没有驻留页；T停止或跟踪。)这些字母来表示。
[*]START，进程开始运行时间。
[*]TIME，进程使用的总CPU时间。
[*]COMMAND，被执行的命令行。
[/list]

ps -aux | grep nginx  /*在所有进程中，查找nginx的进程*/
```
