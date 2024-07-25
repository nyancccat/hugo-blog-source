+++
title = "申请 Let's Encrypt SSL 证书配置 Nginx 开启站点 HTTPS"
description = "申请 Let's Encrypt SSL 证书配置 Nginx 开启站点 HTTPS"
tags = ["SSL"]
date = "2017-06-20"
lastmod = "2017-06-23"
categories = ["乱七八糟"]
slug = "lets-encrypt"
+++

## 安装客户端

Ubuntu 16.04.2 LTS  自带带有软件包，安装非常简单，直接一条命令搞定。

```
apt-get install letsencrypt
```

**但是**，官方最近提供  [certbot](https://certbot.eff.org/)  这样的自动化部署工具并推荐使用，我不太清楚上面这条命令所安装的客户端和 Certbot 是否一样，感觉是一样的，试了一下上面所安装的客户端用的操作指令是 `letsencrypt` ，certbot 用的指令是`certbot` 。

**并且**，访问这官方工具的 Github 原来项目地址：https://github.com/letsencrypt/letsencrypt  会直接跳转到了 https://github.com/certbot/certbot 。为了避免搞混淆，本文将统一使用 `certbot` 指令，因此，我**并没有**使用上面这条命令安装。

简单说明下，下面正式开始：

Certbot 官方地址 https://certbot.eff.org/ 里面有安装说明，你只要选择 Web服务器 （比如 Nginx）和操作系统 （ 比如 Ubuntu ）就会有比较详细的安装过程说明，但是既然在项目也提交在 Github 上，那么还是用 `git` 吧，下载并进入目录：

```g
git clone https://github.com/certbot/certbot
cd certbot
```

可以运行 `./certbot-auto --help` 看看说明。

## 获取证书

Certbot 支持多种不同的插件来获取证书，比如 [webroot](https://certbot.eff.org/docs/using.html#webroot)，多数文章会推荐这种，它的好处是不需要停止 Web 服务器，也就是获取过程中你的网站可以正常运行，但是这种方式需要指定目录及服务器上创建临时文件，通过 Let’s Encrypt 验证服务器发出 HTTP 请求，验证通过后即颁发证书，涉及目录权限之类的，容易出问题，为了避免不必要的麻烦，所以我没有用这个插件获取。

我用的是 [standalone](https://certbot.eff.org/docs/using.html#standalone) ，这种方式申请证书时将启动 Certbot 内置的 Webserver，这时候你的 80 和 443 端口不能被占用，通常是暂停 Web 服务器，我这里是 Nginx，个人网站嘛，暂停十几秒钟没什么影响。推荐不想出现各种奇怪问题的朋友用这种方式。

```
/etc/init.d/nginx stop
```

然后：

```
./certbot-auto certonly --standalone
```

提示输入域名，多个域名用**空格**隔开，比如输入`clearsky.me www.clearsky.me `，输入后回车。

也可以直接用 `-d` 直接加：

```
./certbot-auto certonly --standalone -d clearsky.me www.clearsky.me
```

出现：

```
 - Congratulations! Your certificate and chain have been saved at
   /etc/letsencrypt/live/clearsky.me/fullchain.pem. Your cert will
   expire on 2017-09-17. To obtain a new or tweaked version of this
   certificate in the future, simply run certbot-auto again. To
   non-interactively renew *all* of your certificates, run
   "certbot-auto renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

就成功了，看提示，所有的证书文件在 `/etc/letsencrypt/live/你的域名` 下，里面有下面几个文件：

{{< admonition info >}}
- `privkey.pem` 这是私匙，对应 Nginx 的 ssl_certificate_key 选项，或者 Apache2 的 SSLCertificateKeyFile 选项。
- `cert.pem` 服务器证书，这个只有 Apache2 低于 2.4.8 版本需要，对应 SSLCertificateFile 选项。
- `chain.pem` 除服务器证书之外的所有证书，对于 1.3.7 版以上的 Nginx 对应 ssl_trusted_certificate 选项，对于低于2.4.8 的 Apache2 对应 SSLCertificateChainFile 选项。
- `fullchain.pem` 包括上面的服务器证书和其他证书, Nginx 对应 ssl_certificate 选项，2.4.8 版以上的 Apache2 对应 SSLCertificateFile 选项。
{{< /admonition >}}


如果是 Nginx，需要上面的 `privkey.pem`（对应 ssl_certificate_key 选项）和 `fullchain.pem` （对应 ssl_certificate 选项），还需要一个 `dhparam.pem`（对应 ssl_dhparam 选项） 需自己生成：

```
openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048
```

这个文件创建稍微需要一点时间，注意看我的路径，我的是在 `/etc/nginx/ssl/` 下，如果没有`ssl `这个目录就自己建一个，当然你换其他地方也行。

有了这三个文件: `privkey.pem`、`fullchain.pem` 、`dhparam.pem` 就可以配置 Nginx 了。

## 配置 Nginx

我用的 Nginx 版本是 `1.10.0`，OpenSSL 版本为 `1.0.2g `。支持开启 HTTP/2，并开启 HSTS ，添加一个 301 跳转规则强制 HTTPS 。下面维基百科凑文章字数：

### 什么是 HTTP/2 ?

> **HTTP/2**（超文本传输协议第2版，最初命名为**HTTP 2.0**），是[HTTP](https://zh.wikipedia.org/wiki/HTTP)协议的的第二个主要版本，使用于[万维网](https://zh.wikipedia.org/wiki/%E5%85%A8%E7%90%83%E8%B3%87%E8%A8%8A%E7%B6%B2)。HTTP/2是[HTTP](https://zh.wikipedia.org/wiki/HTTP)协议自1999年HTTP 1.1发布后的首个更新，主要基于[SPDY](https://zh.wikipedia.org/wiki/SPDY)协议。它由[互联网工程任务组](https://zh.wikipedia.org/wiki/%E4%BA%92%E8%81%94%E7%BD%91%E5%B7%A5%E7%A8%8B%E4%BB%BB%E5%8A%A1%E7%BB%84)（IETF）的Hypertext Transfer Protocol Bis（httpbis）工作小组进行开发。[[1\]](https://zh.wikipedia.org/wiki/HTTP/2#cite_note-charter-1)该组织于2014年12月将HTTP/2标准提议递交至[IESG](https://zh.wikipedia.org/w/index.php?title=Internet_Engineering_Steering_Group&action=edit&redlink=1)进行讨论[[2\]](https://zh.wikipedia.org/wiki/HTTP/2#cite_note-2)，于2015年2月17日被批准。[[3\]](https://zh.wikipedia.org/wiki/HTTP/2#cite_note-approval2-3) HTTP/2标准于2015年5月以RFC 7540正式发表。[[4\]](https://zh.wikipedia.org/wiki/HTTP/2#cite_note-rfc7540-4)

### 什么是 HSTS ?

> **HTTP严格传输安全**（英语：HTTP Strict Transport Security，[缩写](https://zh.wikipedia.org/wiki/%E7%B8%AE%E5%AF%AB)：HSTS）是一套由[互联网工程任务组](https://zh.wikipedia.org/wiki/%E4%BA%92%E8%81%94%E7%BD%91%E5%B7%A5%E7%A8%8B%E4%BB%BB%E5%8A%A1%E7%BB%84)发布的[互联网](https://zh.wikipedia.org/wiki/%E4%BA%92%E8%81%94%E7%BD%91)安全策略机制。[网站](https://zh.wikipedia.org/wiki/%E7%BD%91%E7%AB%99)可以选择使用HSTS策略，来让[浏览器](https://zh.wikipedia.org/wiki/%E6%B5%8F%E8%A7%88%E5%99%A8)强制使用[HTTPS](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%AE%89%E5%85%A8%E5%8D%8F%E8%AE%AE)与网站进行通信，以减少[会话劫持](https://zh.wikipedia.org/wiki/%E4%BC%9A%E8%AF%9D%E5%8A%AB%E6%8C%81)风险[[1\]](https://zh.wikipedia.org/wiki/HTTP%E4%B8%A5%E6%A0%BC%E4%BC%A0%E8%BE%93%E5%AE%89%E5%85%A8#cite_note-cnet-1)[[2\]](https://zh.wikipedia.org/wiki/HTTP%E4%B8%A5%E6%A0%BC%E4%BC%A0%E8%BE%93%E5%AE%89%E5%85%A8#cite_note-cnw-2)。

上面这种非正常人类语言看不看无所谓，主要目的是开启这些，会让你的站点 [Qualys SSL Labs](https://www.ssllabs.com/ssltest/) 评分很容易达到 **A+** ~~

所以，最后我的 Nginx 配置，关于 SSL 部分配置，我是用 [Mozilla SSL Configuration Generator](https://mozilla.github.io/server-side-tls/ssl-config-generator/)  来生成修改的，增加了一些安全配置。更多还在摸索中，保持更新：

```
server {
  listen  80 ;
  listen [::]:80;
  server_name clearsky.me www.clearsky.me;
  return 301 https://$server_name$request_uri;
}
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name clearsky.me www.clearsky.me;
  
  # 不输出 Nginx 版本号及其他错误信息 
  server_tokens   off;

  # HTTPS
  ssl_certificate /etc/letsencrypt/live/clearsky.me/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/clearsky.me/privkey.pem;
  ssl_dhparam /etc/nginx/ssl/dhparam.pem;
  ssl_session_cache shared:SSL:50m;
  ssl_session_timeout 1d;
  ssl_session_tickets off;
  ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_prefer_server_ciphers on;
  ssl_stapling on;
  ssl_stapling_verify on;

  # 开启 HSTS,这么写是为了提交到 https://hstspreload.org/
  add_header Strict-Transport-Security "max-age=31536000; includeSubdomains;preload";

  # 网页不允许被 iframe 嵌套。
  add_header X-Frame-Options DENY;

  # 不允许浏览器对未指定或错误指定的 Content-Type 资源真正类型的猜测行为。
  add_header  X-Content-Type-Options  nosniff;

  # 启用 XSS 保护，检查到 XSS 攻击时，停止渲染页面。
  add_header X-XSS-Protection "1; mode=block";

  # 下面这个还在找资料暂时不管，先注释。
  #add_header  Content-Security-Policy  

  root /var/www/hexo;
  access_log  /var/log/nginx/hexo_access.log;
  error_log   /var/log/nginx/hexo_error.log;
  error_page 404 =  /404.html;
  location ~* ^.+\.(ico|gif|jpg|jpeg|png)$ {
    root /var/www/hexo;
    access_log   off;
    expires      1d;
  }
  location ~* ^.+\.(css|js|txt|xml|swf|wav)$ {
    root /var/www/hexo;
    access_log   off;
    expires      10m;
  }
  location / {
    root /var/www/hexo;
    if (-f $request_filename) {
    rewrite ^/(.*)$  /$1 break;
    }
  }
  location /nginx_status {
    stub_status on;
    access_log off;
 }
}
```

配置好了，别忘了重启 Nginx：

```
/etc/init.d/nginx restart
```

不出意外，地址栏小绿锁出现了。

## 后续证书更新

Let's Encrypt SSL 免费证书为短期证书，只有 90 天期限，提示到期前可以运行命令 `./certbot-auto renew ` 续期，VPS 上可以设置定时任务自动化完成，我还没弄好，主要是不会写脚本。。。暂时先是这样，也不知道能不能行：

```
crontab -e
```

选择 `nano` 编辑：

```
0 0 28 * * /etc/init.d/nginx stop
0 1 28 * * cd certbot && ./certbot-auto renew
0 2 28 * * openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048
0 3 28 * * /etc/init.d/nginx restart
```

感觉好搓。。。等过两天休息有空了恶补下 Linux 命令再试试。

凌晨 4 点，又一个失眠晚上了，唉。。。

@update：2017.6.23，今天回家，没什么心思，直接几个命令硬凑一个脚本了：

```sh
#!/bin/sh
cd certbot && openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048 && /etc/init.d/nginx stop && ./certbot-auto renew --standalone && /etc/init.d/nginx start
```

保存为 `auto-renew.sh` ，扔到 `/root/scripts/` ，继续  `crontab -e` ，编辑为：

```
0 0 28 * * sh scripts/auto-renew.sh
```

暂时这样吧。