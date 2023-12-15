+++
title = "VPS 压力测试工具 siege 和 httpbench"
description = "VPS 压力测试工具s iege 和 httpbench"
tags = ["httpbench","siege","VPS"]
date = "2014-07-12 11:58:21"
lastmod = '2014-07-20'
categories = ["学习备忘"]
slug = "webserver-test"
+++

## 闲

闲得没事对所用VPS来个压力测试。现在所用的VPS是去年年付的一个，配置挺低的：

内存256MB且无突发，硬盘30G，月流量500G，操作系统ubuntu 13.10 32bit。

一般常用压力测试用的软件是webbench或者是http_load，我以前也用过，这两个网上一搜一大堆文章。这次懒得用了，换其它的试试玩玩。用的是siege和HttpBench，记录一下:

## Siege

Sigeg官方主页：[http://www.joedog.org/siege-home/](http://www.joedog.org/siege-home/)

官方说明：直接引用官方一堆蝌蚪文~

> What Is It?
>
> Siege is an open source stress / regression test and benchmark utility. It can stress a single URL with a user defined number of simulated users or it can read many URLs into memory and stress them simultaneously. The program reports the total number of hits recorded, bytes transferred, response time, concurrency, and return status. Most features are configurable with command line options which also include default values to minimize the complexity of the program’s invocation. Siege allows you to stress a web server with n number of users t number of times, where n and t are defined by the user. It records the duration time of the test as well as the duration of each single transaction. It reports the number of transactions, elapsed time, bytes transferred, response time, transaction rate, concurrency and the number of times the server responded OK, that is status code 200\. Siege was designed and implemented by Jeffrey Fulmer in his position as Webmaster for Armstrong World Industries. It was modeled in part after Lincoln Stein’s torture.pl and it’s data reporting is almost identical. But torture.pl does not allow one to stress many URLs simultaneously; out of that need siege was born… When a httpd server is being hit by the program, it is said to be “under siege.”


最新版本下载地址：[http://download.joedog.org/siege/siege-latest.tar.gz](http://download.joedog.org/siege/siege-latest.tar.gz)

### 下载安装

root登陆vps，然后

```bash
mkdir tools
cd tools
#还是建个tools目录放这些东西好一点
```

#下载并解压

```bash
wget http://download.joedog.org/siege/siege-latest.tar.gz
tar zxvf siege-latest.tar.gz
```

这个时候可以输入个`ls`命令查看目录，最新的版本是3.0.6,于是

```bash
cd siege-3.0.6
./configure
make && make installl
#进入siege-3.0.6目录并编译安装
```

没什么问题的话完成后就会出现siege的各种参数使用说明。

### 参数设置

除了看上面完成后的参数设置按常规还可以输入`siege -h`来查看。

测试命令：`siege [options] URL`

`[options]`是各种参数，一般会用到:

```bash
-c  //并发数，默认是10。

-t  //测试时间，单位是分钟，-t 10表示持续10分钟。

-f  //对应内容为一行一个url的文件来测试。

-r  //重复次数。
```

更多用法详见参数，`siege -h`

`URL`就是需要测试的ip地址，对应域名也可以。

### 测试一下

先温柔点：

```bash
siege https://clearsky.me -c 100 -t 3    #并发数100，持续3分钟
```

实时感受，打开网站基本没什么变化,没明显感觉慢，最后完成后出现了个：

>[error]unable to create log file: No such file or directory

如果出现这个问题直接在`/usr/local`目录下新建个`var`目录就可以了，

结果输出：

```bash
Transactions:		        1508 hits         //总共完成处理次数
Availability:		        100.00 %          //成功率
Elapsed time:		        179.91 secs       //总耗时
Data transferred:	        5.01 MB           //总共传输数据大小
Response time:		        10.98 secs        //响应时间
Transaction rate:	        8.38 trans/sec    //平均每秒处理次数
Throughput:		        0.03 MB/sec       //每秒传输数据大小
Concurrency:		        92.05             //最高并发数
Successful transactions:        1508              //成功次数
Failed transactions:	        0                 //失败次数
Longest transaction:	        12.59             //每次最长时间
Shortest transaction:	        0.72              //每次最短时间
```

加重一点：

```bash
siege https://clearsky.me -c 500 -t 5    #并发数500，持续5分钟
```

出现：

>[fatal] unable to allocate memory for 500 simulated browser: Cannot allocate memory

搜索了一下：找到这样解释：via:[Siege使用笔记](http://www.iteye.com/topic/1123465)

> 性能测试过程中，当并发数达到一定情况下可能会遇到“FATAL: unable to allocate memory for ** simulated browser: Cannot allocate memory”类似错误，这是由于linux系统配置限制导致的，可通过"ulimit -a"查看, 修改参数来进行调试（但总会受限于硬件设备）

于是我减小到300，感觉打开已经很慢了，卡卡的，测试结果如下：

```bash
Transactions:		        174 hits        //总共完成处理次数    
Availability:		        12.86 %         //成功率
Elapsed time:		        20.96 secs      //总耗时
Data transferred:	        0.76 MB         //总共传输数据大小
Response time:		        10.76 secs      //响应时间
Transaction rate:	        8.30 trans/sec  //平均每秒处理次数
Throughput:		        0.04 MB/sec     //每秒传输数据大小
Concurrency:		        89.34           //最高并发数
Successful transactions:        174             //成功次数
Failed transactions:	        1179            //失败次数
Longest transaction:	        17.88           //每次最长时间
Shortest transaction:	        0.02            //每次最短时间
```

## Httpbench

这个是我以前在hostloc上看到有人发的，挺小巧的，也相对简单。

官方地址：[https://code.google.com/p/httpbench/](https://code.google.com/p/httpbench/)

下载地址：[https://httpbench.googlecode.com/files/httpbench-0.11.tar.gz](https://httpbench.googlecode.com/files/httpbench-0.11.tar.gz)

官方简单说明：
> Requirement:
>
> linux with kernel 2.6 or higher
>
> Install:
>
> make && make install
>
> Usage:
>
> httpbench thread-numbers url

先是下载安装，root登陆终端后：

### 下载解压

```bash
wget https://httpbench.googlecode.com/files/httpbench-0.11.tar.gz
tar zxvf httpbench-0.11.tar.gz
```

然后：

### 进入目录并安装
```bash
cd httpbench
make && make install
```

### 完成后测试

```bash
httpbench 200 https://clearsky.me/    #不要忘了后面的斜杠“/”
```

运行之后随时`Ctrl + C`终止，终止后就看到简单的数据：

```bash
Speed=83323 pages/min, 452984 bytes/sec.
Requests: 45628 susceed, 200 failed.
```
## 结束小小小小小总结

话说 200 就搞得 nginx 挂了，我这 vps 得有多搓，好了，就到这了。
