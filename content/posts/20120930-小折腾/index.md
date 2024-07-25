+++
title = "VPS 小折腾"
description = "VPS 小折腾"
tags = ["VPS"]
date = "2012-09-30 00:26:05"
lastmod = '2009-09-30'
categories = ["学习备忘"]
slug = "freevps"
+++

## FreeVPS
中秋节回家上上网，前段时间值班时候无聊申请的freevps开通邮件到了，准备这几天有时间极限压榨下这个性能极其低下的vps，为了练练手，过段时间年付个便宜vps，性能烂无所谓，反正不放站，要求也不高，能搭个梯子自用，偶尔折腾玩玩就行。

说说这个免费的吧，128内存，5G硬盘，500G流量，知道的一猜就知道是哪个了。配置很低，但练手足够了，编译lnmp花了差不多一个小时。先扔着吧，过两天有时间，网上多翻翻资料，折腾一下，差不多了就入手个够自己用的。

下面是测试数据，算是悲剧。

## VPS 参数

### 内存

```bash
total       used       free     shared    buffers     cached

Mem:           128         84         43          0          0         61

-/+ buffers/cache:         22        105

Swap:          128         26        101</div>
```
### 下载测试

```bash
wget http://cachefly.cachefly.net/100mb.test
```

{{< admonition info >}}
--2012-09-30 14:11:16--  http://cachefly.cachefly.net/100mb.test

Resolving cachefly.cachefly.net... 205.234.175.175

Connecting to cachefly.cachefly.net|205.234.175.175|:80... connected.

HTTP request sent, awaiting response... 200 OK

Length: 104857600 (100M) [application/octet-stream]

Saving to: ?.00mb.test?

100%[================================================>] 104,857,600 14.5M/s   in 10s

2012-09-30 14:11:27 (9.82 MB/s) - ?.00mb.test?.saved [104857600/104857600]
{{< /admonition >}}


### CPU

```bash
cat /proc/cpuinfo
```
{{< admonition info >}}
processor	: 0

vendor_id	: AuthenticAMD

cpu family	: 16

model		: 2

model name	: AMD Opteron(tm) Processor 6172

stepping	: 3

cpu MHz		: 2100.025

cache size	: 512 KB

physical id	: 0

siblings	: 4

core id		: 0

cpu cores	: 4

apicid		: 0

initial apicid	: 0

fpu		: yes

fpu_exception	: yes

cpuid level	: 5

wp		: yes

flags		: fpu vme de pse tsc msr pae mce cx8 apic mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ht syscall nx mmxext fxsr_opt rdtscp lm 3dnowext 3dnow constant_tsc rep_good tsc_reliable nonstop_tsc unfair_spinlock pni cx16 popcnt hypervisor lahf_lm extapic abm sse4a misalignsse 3dnowprefetch osvw

bogomips	: 4200.05

TLB size	: 1024 4K pages

clflush size	: 64

cache_alignment	: 64

address sizes	: 40 bits physical, 48 bits virtual

power management:
{{< /admonition >}}

### 硬盘性能

太差了~

```bash
dd if=/dev/zero of=test bs=64k count=512 oflag=dsync</pre>
```

卡住好久，懒得贴了。

### ping

最快：美国堪萨斯[海外] 34 毫秒    最慢：陕西西安[电信] 639 毫秒

电信平均： 422 毫秒    联通平均： 387 毫秒
