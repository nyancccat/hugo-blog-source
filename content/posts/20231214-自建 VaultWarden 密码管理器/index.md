---
title: "自建 VaultWarden 密码管理器"
slug: "vaultwarden"
date: 2023-12-14T16:04:40+08:00
description: "自建 VaultWarden 密码管理器"
tags: ["VaultWarden", "Bitwarden"]
categories: ["学习备忘"]
---

## 起因

这么多年上网，注册的网站不少，~~为了密码安全~~懒得敲键盘，一直使用 [LastPass](https://www.lastpass.com/) 来管理密码，配合浏览器扩展登录各类网站时候非常丝滑，用了这么多年 LastPass 也一直没怎么关注它，中间还说过收费但是我浏览器扩展一直在用也没见有什么影响，这两天闲来无事网上翻翻才知道它已经有过多次密码泄露事件了，还有，也许是我经常更换 IP 的原因，LastPass 经常要求授权验证，体验相当糟糕，于是想着换成其他的，反正这类工具大同小异，对我来说能用就行，网上搜类似服务的时候看到有人提到**密码数据这么私密，为什么不掌握在自己手中**，想想说的也是，刚好手头上有一台闲置的 VPS 吃灰好久了，于是打算拿来自建一个密码管理器使用。

## 需求

-   自托管控制：能够保持对密码管理器基础设施的完全控制，托管在您自己的服务器或受信任的云服务上，确保您的敏感数据保留在您的手中。
-   跨平台可用性：支持多种平台，包括 Windows、macOS、Linux、iOS 和 Android。可以从台式计算机、笔记本电脑和移动设备方便地访问您的密码和安全信息。
-   加密安全：采用最先进的加密技术。确保密码和敏感信息在安全传输并存储在服务器上进行本地加密。
-   支持浏览器扩展：为浏览器提供浏览器扩展，提供用户友好的体验。

## Bitwarden

先看了 Bitwarden，但是一看官网文档推荐安装配置：

| System specifications |           Minimum            |         Recommended          |
| :-------------------- | :--------------------------: | :--------------------------: |
| Processor             |         x64, 1.4GHz          |     x64, 2GHz dual core      |
| Memory                |           2GB RAM            |           4GB RAM            |
| Storage               |             12GB             |             25GB             |
| Docker Version        | Engine 19+ and Compose 1.24+ | Engine 19+ and Compose 1.24+ |

再看看我手头上这台 VPS，1 核 1G 内存，硬盘才 16G，安装这个这个怕是太勉强了，果断放弃。

## Vaultwarden

Vaultwarden 是一个使用 Rust 编写的非官方 Bitwarden 服务器实现，它与官方 Bitwarden 客户端兼容，非常适合不希望运行官方的占用大量资源的自托管部署，它是理想的选择。Vaultwarden 面向个人、家庭和小型组织。

使用 Vaultwarden 这个第三方项目优势很明显：

-   和官方服务拥有相同的安全性。
-   可完美兼容 Bitwarden 全平台客户端。
-   安装所需的系统环境门槛更低，运行消耗资源更少。
-   完全免费，默认就有了官方 Bitwarden 付费版的全部功能。

### 安装

关于 Vaultwarden 一些链接：

-   [Vaultwarden Github](https://github.com/dani-garcia/vaultwarden)
-   [Vaultwarden Docker Hub](https://hub.docker.com/r/vaultwarden/server)
-   [Vaultwarden Wiki](https://github.com/dani-garcia/vaultwarden/wiki)

我使用的是 Docker 部署安装，之前的版本（v1.29.0 前）需要环境变量设置开启 WebSocket，主要是为了多端同步，安装时候要多开一个端口（默认是 3012）给 WebSocket 运行，自 Vaultwarden v1.29.0 之后的版本开始，WebSocket 默认启用，且不需要开设单独端口。

我本身用着 1Panel 面板，直接新添加一个网站，绑定域名，如 `vw.yourdomain.com`,类型选择反向代理，代理端口 8087 （这个随意设置）。

![反向代理设置](Reverse_proxy.webp "Reverse_proxy")

进入网站目录，拉取镜像执行。

```bash
docker pull vaultwarden/server:latest
docker run -d --name vaultwarden -v ./vw-data/:/data/ --restart unless-stopped -p 8087:80 vaultwarden/server:latest
```

这里端口设置记得和上面的代理端口一样，为 `8087`，不出意外的话，Vaultwarden 已经运行了，数据保存在当前目录 `/vw-data/`。

### 启用 HTTPS

要正常使用 Vaultwarden，还需要启用 HTTPS，就是给绑定域名申请个证书，原因来自官方 Wiki:

> For proper operation of vaultwarden, enabling HTTPS is pretty much required nowadays, since the Bitwarden web vault uses web crypto APIs that most browsers only make available in HTTPS contexts.

使用 1Panel 面板就很简单了，一键为绑定域名申请并自动续签 Let’s Encrypt 证书，略。

添加完证书打开 `vw.yourdomain.com`，就可以看到 Vaultwarden 登录界面了。

![Vaultwarden 登录界面](vaultwarden-login.webp "Vaultwarden 登录界面")

### Vaultwarden 设置

可以在构建时候命令设置环境变量，或者写一个 Docker-Composer 部署，因为我是用的 1Panel 面板，Docker 管理很方便，所以我一般比较喜欢先跑起来再说，再在面板 Docker 管理器慢慢设置环境变量，下面列举常用的一些设置：

#### 禁用新用户注册

SIGNUPS_ALLOWED=false

我没有禁止，地址发给朋友，范围使用。

#### 禁用邀请

INVITATIONS_ALLOWED=false

#### 启用管理页面

管理页面允许服务器管理员查看并删除所有已注册的用户，也可以在此界面设置一些如开启邀请、禁用注册等功能，我没有开启，感觉还不如设置环境变量方便。

要启用管理页面，您需要设置一组身份验证令牌。该令牌可以是任何字符，但建议使用随机生成的长字符串，比如运行 `openssl rand -base64 48` 命令生成。

ADMIN_TOKEN=some_random_token_as_per_above_explanation

然后在域名后面加上 `/admin`，就可以登录 Vaultwarden 管理后台，登陆验证为为刚刚设置的 `ADMIN_TOKEN`。

如果取消，则取消设置 ADMIN_TOKEN 并重启 Vaultwarden。

#### 启用移动客户端推送通知

为了移动客户端也能实时同步密码库，需要启用移动客户端推送通知，访问[这里](https://bitwarden.com/host/)，输入您的电子邮件地址，地区选择 United States，提交后会获得一个 `INSTALLATION_ID` 和 `INSTALLATION_KEY`。然后，环境变量里面设置：

PUSH_ENABLED=true

PUSH_INSTALLATION_ID=xxx // 刚才得到的 ID

PUSH_INSTALLATION_KEY=xxx // 刚才得到的 KEY

#### SMTP 配置

SMTP_HOST=<smtp.domain.tld>

SMTP_FROM=<vaultwarden@domain.tld>

SMTP_PORT=port

SMTP_SECURITY=starttls

SMTP_USERNAME=username

SMTP_PASSWORD=password

这里是完整的环境变量设置，[vultwarden/.env.template](https://github.com/dani-garcia/vaultwarden/blob/main/.env.template)，可以仔细看看。

### Vaultwarden 插件和各端 APP 下载

Vaultwarden 可完美兼容 Bitwarden 全平台客户端。所以直接使用 Bitwarden 的即可。

-   [Google Play](https://play.google.com/store/apps/details?id=com.x8bit.bitwarden)
-   [Apple Store](https://apps.apple.com/us/app/bitwarden-password-manager/id1137397744)
-   [Bitwarden 官方下载页](https://bitwarden.com/download/)
-   [Google Chrome 应用商店](https://chromewebstore.google.com/detail/bitwarden-%E5%85%8D%E8%B4%B9%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86%E5%99%A8/nngceckbapebfimnlniiiahkandclblb?pli=1)
-   [Microsoft Edge 应用商店](https://microsoftedge.microsoft.com/addons/detail/bitwarden-%E5%85%8D%E8%B4%B9%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86%E5%99%A8/jbkfoedolllekgbhcbcoahefnbanhhlh)

## Vaultwarden 使用

日常使用和 LastPass 软件这类没什么区别，如我常用的浏览器扩展，登录时候选择自托管，输入绑定域名就可以了,设置个主密码就可以了。

![浏览器扩展](vaultwarden-kz.webp "vaultwarden-kz.webp")

## 导入 LastPass 密码库

### 从 LastPass 导出

登录 LastPass 网页版，边栏选择 Advanced Options 选项，选择 Export 选项导出（CSV）。

### Vaultwarden 导入

各端的设置-导入项目-格式选择 LastPass 导入上面的 CSV 文件。

## Vaultwarden 工具

我密码数据大概 260+，好多页面都打不开了，趁着有心情就整理一下分个类什么的，整理的时候发现 Vaultwarden 有一些工具，有个暴露检测，拿来试试。

![Vaultwarden 工具](vaultwarden-tools.webp "vaultwarden-tools.webp")

检测结果：

![暴露密码检测报告](vaultwarden-report.webp "vaultwarden-report.webp")

抽空把一些比较重要的改一下吧，这次全部大小写字母 + 数字 + 特殊符号 + 18 位数随机生成了。
