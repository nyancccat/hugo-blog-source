+++
title = "Ubuntu 16.04 使用 youtube-dl + FFmpeg 下载 Youtube 1080p 视频"
description = "Ubuntu 16.04 使用 youtube-dl + FFmpeg 下载 Youtube 1080p 视频"
tags = ["视频下载"]
date = "2017-07-03 23:36:04"
lastmod = '2017-07-17'
categories = ["乱七八糟"]
slug = "youtube-dl-ffmprg"
+++


## 凑目录

今天在 Youtube 上下载了一个 1080p 的视频，点开后发现没有声音，看看目录里面还有个音频，才发现 Youtube 1080p 的视频和音频是分开的，720p 倒是合在一起的没问题。既然是分开的还需要自己合成起来，用的是 FFmpeg，每次下载 1080p 都要自己合成一次太麻烦了。要是能下载时候自动合成就好了。还有，我一般都是挂着 ss 下载，但总感觉这样比较慢，在 VPS 上安装，视频下载完成拖回本地，应该会好一点。这里用的是下载神器  [youtube-dl](https://rg3.github.io/youtube-dl/index.html) 和 FFmpeg 配合。

## 安装 FFmpeg

操作系统是 Ubuntu 16.04.2 LTS，安装 FFmpeg 很简单：

```
add-apt-repository ppa:djcj/hybrid
apt-get update
apt-get install ffmpeg
```

## 安装 youtube-dl

详见官网：https://rg3.github.io/youtube-dl/download.html

我用的是 `wget` :

```
wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-d
chmod a+rx /usr/local/bin/youtube-dl
```

## 使用 youtube-dl

用 `youtube-dl -h` 查看帮助，这货参数太多了，没仔细看，基本用法:

```
youtube-dl https://www.youtube.com/watch?v=IW_kWtI9EUg
```

上面就会下载默认格式，如果需要下载指定格式，可以先：

```
youtube-dl -F https://www.youtube.com/watch?v=IW_kWtI9EUg
```

返回：

```
[youtube] IW_kWtI9EUg: Downloading webpage
[youtube] IW_kWtI9EUg: Downloading video info webpage
[youtube] IW_kWtI9EUg: Extracting video information
[youtube] IW_kWtI9EUg: Downloading MPD manifest
[info] Available formats for IW_kWtI9EUg:
format code  extension  resolution note
139          m4a        audio only DASH audio   48k , m4a_dash container, mp4a.40.5@ 48k (22050Hz)
249          webm       audio only DASH audio   55k , opus @ 50k, 1.14MiB
250          webm       audio only DASH audio   72k , opus @ 70k, 1.51MiB
140          m4a        audio only DASH audio  128k , m4a_dash container, mp4a.40.2@128k (44100Hz)
251          webm       audio only DASH audio  140k , opus @160k, 2.99MiB
171          webm       audio only DASH audio  142k , vorbis@128k, 3.09MiB
160          mp4        256x144    DASH video  113k , avc1.4d400c, 30fps, video only
278          webm       256x144    144p  121k , webm container, vp9, 30fps, video only, 2.30MiB
133          mp4        426x240    DASH video  266k , avc1.4d4015, 30fps, video only
242          webm       426x240    240p  282k , vp9, 30fps, video only, 5.47MiB
243          webm       640x360    360p  505k , vp9, 30fps, video only, 10.12MiB
134          mp4        640x360    DASH video  644k , avc1.4d401e, 30fps, video only
244          webm       854x480    480p  896k , vp9, 30fps, video only, 18.53MiB
135          mp4        854x480    DASH video 1176k , avc1.4d401f, 30fps, video only
247          webm       1280x720   720p 1748k , vp9, 30fps, video only, 36.29MiB
136          mp4        1280x720   DASH video 2329k , avc1.4d401f, 30fps, video only
248          webm       1920x1080  1080p 3146k , vp9, 30fps, video only, 63.64MiB
137          mp4        1920x1080  DASH video 4143k , avc1.640028, 30fps, video only
17           3gp        176x144    small , mp4v.20.3, mp4a.40.2@ 24k
36           3gp        320x180    small , mp4v.20.3, mp4a.40.2
43           webm       640x360    medium , vp8.0, vorbis@128k
18           mp4        640x360    medium , avc1.42001E, mp4a.40.2@ 96k
22           mp4        1280x720   hd720 , avc1.64001F, mp4a.40.2@192k (best)
```

第一列是 `id`，第二列是文件格式，后面是视频信息。

如果直接想下载哪一种格式的就直接 `-f id` 就好了，比如下载格式为 **720p / mp4** 格式的，它的 `id` 是 `22`，那么直接：

```
youtube-dl -f 22 https://www.youtube.com/watch?v=IW_kWtI9EUg
```

就下载完成了。

 1080p 视频和音频是分开的，可以看到有些格式带有 `video only` ，有些带有 `audio only ` ，选两个你自己喜欢的组合吧。比如我要下载 **1080p / mp4** 的视频和 **128k / m4a** 的音频，他们的 `id` 分别是 `137` 和 `140` ，那么使用：

```
youtube-dl -f 137+140 https://www.youtube.com/watch?v=IW_kWtI9EUg
```

youtube-dl 就用下载这两个视频和音频并调用 FFmpeg 合成为一个文件，并删除原来两个视频和音频。

小提示：`mp4 + m4a` 会合成为一个 `mp4` 文件， `mp4 + webm` 会兼容合成为 `.mkv` 文件，一般为了方便视频以后上传什么的我都选择 `mp4 + m4a` 组合。

## 拖回本地

视频在 VPS 下载完成后需要拖回本地，方法随意了，我是偷懒直接把视频下载在 Nginx 的 `www` 目录，用下载工具直接拖回来，工具用的是 IDM，不建议使用迅雷你懂的。

服务器是搬瓦工，拖回来后连忙删除 VPS 的视频，一是流量少耗不起，二是下载了带版权的视频被停就麻烦了。



