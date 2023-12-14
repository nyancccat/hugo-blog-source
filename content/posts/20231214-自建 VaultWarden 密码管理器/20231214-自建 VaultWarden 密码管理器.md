---
title: '自建 VaultWarden 密码管理器'
slug: 'vaultWarden'
date: 2023-12-14T16:04:40+08:00
description: '自建 VaultWarden 密码管理器'
draft: true
tags: ['VaultWarden,Bitwarden']
categories: ['学习备忘']
---

## 起因

这么多年上网，注册的网站不少，为了~~密码安全~~节省输入密码时间，一直使用 LastPass 来管理密码，配合浏览器扩展登录各类网站时候非常丝滑，用了这么多年 LastPass 也一直没怎么关注它，中间还说过收费但是我浏览器扩展一直在用也没见有什么影响，这两天闲来无事网上翻翻才知道它已经有过多次密码泄露事件了，还有，也许是我经常更换 IP 的原因，LastPass 经常要求授权验证，体验相当糟糕，于是想着换成其他的，反正这类工具大同小异，对我来说能用就行，网上搜类似服务的时候看到有人提到**密码这么私密，为什么不掌握在自己手中**，想想说的也是，刚好手头上有一台闲置的 VPS 吃灰好久了，于是打算拿来自建一个密码管理器使用。

## Bitwarden

先看了 Bitwarden，但是一看推荐安装配置：

| System specifications | Minimum | Recommended |
| :--- | :------: |:------: |
| Processor |  x64, 1.4GHz | x64, 2GHz dual core |
| Memory | 2GB RAM | 4GB RAM |
| Storage | 12GB  | 25GB |
| Docker Version | Engine 19+ and Compose 1.24+ | Engine 19+ and Compose 1.24+ |

再看看我手头上这台 VPS，1 核 1G内存，硬盘才16G，安装这个这个怕是太勉强了，果断放弃。

## Vaultwarden

Vaultwarden 是一个使用 Rust 编写的非官方 Bitwarden 服务器实现，它与官方 Bitwarden 客户端兼容，非常适合不希望运行官方的占用大量资源的自托管部署，它是理想的选择。Vaultwarden 面向个人、家庭和小型组织。

使用 Vaultwarden 这个第三方优势很明显：

- 和官方服务拥有相同的安全性
- 数据完全掌握在自己手中，不用担心官方服务故障或跑路
- 完全免费，免费使用官方付费版的全部功能
