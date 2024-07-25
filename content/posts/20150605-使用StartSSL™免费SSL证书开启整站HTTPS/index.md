+++
title = "使用 StartSSL™ 免费 SSL 证书开启整站 HTTPS"
description = "使用 StartSSL™ 免费 SSL 证书开启整站 HTTPS"
tags = ["SSL"]
date = "2015-06-05 00:25:06"
lastmod = "2015-08-25"
categories = ["学习备忘"]
slug = "startssl-https"
toc = false
+++

失眠好几天了，大半夜睡不着，但是头又晕呼呼的，翻点资料瞎折腾的，估计写得乱七八糟，就这样了，纯记录。

* * *

用的是[StartSSL™ ](https://www.startssl.com/)提供的证书，免费一年，据说到期可以再生成一个继续用。

怎么申请StartSSL™ 的证书的资料网上一搜一大堆，懒得写了。这里简单记录一下nginx下安装配置ssl，以免下次我又要到处翻资料。

申请完得到两个文件`ssl.crt`和`ssl.key`。

系统环境约定：CentOS6.4 64位 + 军哥的一键包LNMP1.1。

（写完这篇的时候发现军哥LNMP1.2发布了，默认启用spdy和增加ssl范例配置，本文还是以LNMP1.1为例）。

nginx配置目录在`/usr/local/server/nginx/conf/`，把这两个文件上传到此目录，在此目录下：

通过Openssl安装，免去nginx启动每次输入公匙。

```bash
openssl rsa -in ssl.key -out /usr/local/server/nginx/conf/ssl_ca.key
```

提示输入公匙（申请的时候自己设的），完成后得到一个`ssl_ca.key`

获取合并Startssl的证书，解决Firefox不信任问题：

```bash
wget http://www.startssl.com/certs/ca.pem
wget http://www.startssl.com/certs/sub.class1.server.ca.pem
cat ssl.crt sub.class1.server.ca.pem ca.pem > /usr/local/server/nginx/conf/ssl_ca.crt
```

这个`ssl_ca.crt`还不能直接使用，需要修改下，真的用不惯vi，所以：

```bash
nano /usr/local/server/nginx/conf/ssl_ca.crt
```

找到一处：

-----END CERTIFICATE----------BEGIN CERTIFICATE-----

加个换行，改成

-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----

反正左右各5个横杠，保存!

这时候已经得到两个文件：`ssl_ca.key`和`ssl_ca.crt`

接下来配置nginx，首先启用spdy。

开启spdy需要较新版本Openssl，先下载解压，我这里是在`/tmp`目录操作:

```bash
cd /tmp
wget http://www.openssl.org/source/openssl-1.0.1e.tar.gz
tar zxvpf openssl-1.0.1e.tar.gz
```

编辑lnmp（或lnmp1.1-full）目录下`upgrade_nginx.sh`。

找到这一行：

```bash
/configure --user=www --group=www --prefix=/usr/local/nginx
```

在这行的末尾加上:

```bash
    --with-http_spdy_module --with-openssl=/tmp/openssl-1.0.1e
```

(注意：这行前有个空格，目录也要对应，我之前下载在tmp目录）

保存后，执行upgrade_nginx.sh升级nginx,我原来是1.6，直接升级到最新的1.9.2。

完成后可以运行下面这行来查看有没有spdy模块:

```bash
/usr/local/nginx/sbin/nginx -V #查看nginx安装了什么模块
```

接着编辑`/usr/local/nginx/conf/vhost`下的`yourdomain.conf`文件。

主要部分，监听443端口，开启SSL，启用spdy，下面的SSLv3据说有漏洞，自行考虑。

```bash
listen 443 ssl spdy;
#listen [::]:80;
ssl on;
ssl_certificate /usr/local/nginx/conf/ssl_ca.crt;
ssl_certificate_key /usr/local/nginx/conf/ssl_ca.key;
ssl_session_timeout     5m;
ssl_protocols           SSLv2 SSLv3 TLSv1;
ssl_prefer_server_ciphers       on;
ssl_ciphers             ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
```

**上面这段已经弃用**，// 2015.8.25更新如下，解决Chrome显示“之间的连接采用了过时的加密技术”的问题：

```bash
listen 443 ssl spdy;
#listen [::]:80;

ssl on;
ssl_certificate /usr/local/nginx/conf/ssl_ca.crt;
ssl_certificate_key /usr/local/nginx/conf/ssl_ca.key;

ssl_session_timeout     5m;
ssl_session_cache shared:SSL:10m;
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

ssl_prefer_server_ciphers       on;
ssl_ciphers "ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES256-GCM-SHA384:AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256:AES256-SHA:AES128-SHA:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4";
```

监听80端口，http强制跳转https：

```bash
server
    {
    listen       80;
    server_name clearsky.me www.clearsky.me;
    rewrite ^/(.*)$ https://clearsky.me/$1 permanent;
    }
```

重启Nginx后。需要让页面内资源支持https，我用的最简单粗暴的：

WordPress设置-常规，把WordPress地址（URL）和 站点地址（URL）都设置成https。

然后进数据库，文章内容和评论里面批量替换链接（注意备份），SQL执行：

```sql
UPDATE wp_posts SET post_content = REPLACE (post_content, 'http://example.com', 'https://example.com');   
UPDATE wp_posts SET post_content = REPLACE (post_content, 'http://example.com', 'https://example.com');

UPDATE wp_comments SET comment_content = REPLACE( comment_content, 'http://example.com', 'https://example.com' );
UPDATE wp_comments SET comment_content = REPLACE( comment_content, 'http://example.com', 'https://example.com' );
```

我没用上面的，直接用的Search & Replace插件替换的，挺方便的，反正用什么都注意备份。

排查页面引用的外部资源，改成https的，完成后Chrome浏览器下绿锁应该出现了，其它的浏览器没装，不清楚。

然而，除了装逼之外几乎没什么卵用。

几个问题：

1. 网站打开速度好像慢了。
2. 开启SSL之后就去掉Gravata头像缓存到多说，用自家https的，结果用手机上各种浏览器下看不见头像了。~~还是参照大发的[WordPress 缓存Gravatar 头像到本地](http://fatesinger.com/76006)开启头像缓存，心理作用快一点。
3.  用的hermit插件插入网易云音乐地址肯定没https，所以只要一点下面这首歌的播放按钮，绿锁肯定立马带三角。
4. 这下真的困了，可以睡了。

参考资料：

1. https://www.startssl.com/?app=42
2. https://line.dreamq.org/1708spdy
3. https://yusky.me/lnmp-enable-ssl-spdy.html
4. https://cyhour.com/directadmin-install-startssl-free-ssl-certificates.html
