# ZeroMusic - 在线音乐应用

[English](README.md) | 简体中文

一个全栈在线音乐应用，使用 MERN 技术栈（React, Express.js, MongoDB）和 Electron 开发，使用的库包括 Tailwind CSS, Redux, Socket.IO 等。

<p align="center">
    <img src="https://github.com/HaowenHou/zero-music-mern/blob/main/.github/assets/zh-CN/home.png?raw=true" width="90%">
</p>

## 功能

- :star: 收藏音乐 & 添加音乐到歌单（右键菜单）

<p align="center">
    <img src="https://github.com/HaowenHou/zero-music-mern/blob/main/.github/assets/zh-CN/add-to-playlist.png?raw=true" width="40%">
</p>

- :speech_balloon: 评论歌曲 & 查看他人的评论

<p align="center">
    <img src="https://github.com/HaowenHou/zero-music-mern/blob/main/.github/assets/zh-CN/comments.png?raw=true" height="auto" width="80%">
</p>

- :clipboard: 创建和管理歌单 & 收藏他人的歌单

- :cloud: 个人音乐云盘

- :speaker: 发布音乐动态 & 查看朋友的动态

<p align="center">
    <img src="https://github.com/HaowenHou/zero-music-mern/blob/main/.github/assets/zh-CN/posting.png?raw=true" width="35%">
    <img src="https://github.com/HaowenHou/zero-music-mern/blob/main/.github/assets/zh-CN/posts.png?raw=true" width="60%">
</p>

- :blush: 个人主页，展示个人收藏、歌单和动态

<p align="center">
    <img src="https://github.com/HaowenHou/zero-music-mern/blob/main/.github/assets/zh-CN/profile.png?raw=true" height="auto" width="80%">
</p>

- :envelope: 私信（Socket.IO）

<p align="center">
    <img src="https://github.com/HaowenHou/zero-music-mern/blob/main/.github/assets/zh-CN/personal-message.png?raw=true" height="auto" width="80%">
</p>

- :lock: 使用 JWT 进行用户认证

## 如何运行

**所需工具:** Node v20.13.1, npm 10.5.2, MongoDB（本地或云端，如 Atlas）

**依赖安装:** 分别在前端和后端的目录内使用 `npm install` 安装依赖

**后端:**

在后端目录下创建 `.env` 文件，指定如下环境变量：

```env
PORT=""            # 后端端口
MONGO_URI=""       # MongoDB URI，本地或云端。例如："mongodb://localhost:27017/zero-music"
JWT_SECRET_KEY=""  # JWT 的密钥，可以使用 `openssl rand -base64 64` 生成
```

运行 `node app.js`

**前端:**

在 `.env.local` 文件中指定 `VITE_SERVER_URL=` 为后端 URL，*末尾无斜杠*。
比如"http://localhost:3000"

启动 React 前端: `npm run dev`

启动 Electron 客户端: `npm run electron:start`

更改语言: 在 `src/i18n.js` 中设置 `fallbackLng`，支持 `en` 和 `zh-CN`。

## 其他

- 只有管理员可以管理音乐，可以使用 mongosh 将用户设置为管理员：

    ```shell
    db.users.findOneAndUpdate({_id: ObjectId('xxx')}, {$set: {role: "admin"}})
    ```

- 由于该项目一开始用 Next.js 编写，后来分离成 React 和 Express，前端仍然遵循基于文件目录的路由，`[xxx]` 表示动态路由。

- 因为开发时的网络问题，未使用 AWS S3 等云存储服务，而是将所有文件都存储在本地文件系统中。

- 这个项目是为了学习 Web 开发而编写的，没有特别关注代码清晰度和优化。

<details>

<summary><b>RESTful API 设计</b></summary>

### 用户

**GET /api/users/userId [?populate=]** - 获取用户信息。`userId` 可以是 `current`

**POST /api/users** - 注册新用户

**PUT /api/users** - 更新用户信息

**GET /api/users/:userId/following** - 获取用户的关注列表。`userId` 可以是 `current`

**POST/DELETE /api/users/:userId/follow** - 关注/取消关注

### 歌单

**GET /api/playlists/:playlistId** - 获取歌单信息

**POST /api/playlists** - 创建新的歌单

**PUT /api/playlists/:playlistId** - 更新歌单

**DELETE /api/playlists/:playlistId** - 删除歌单

**POST /api/playlists/:playlistId/tracks body: trackId** - 向歌单添加曲目

**DELETE /api/playlists/:playlistId/tracks/:trackId** - 从歌单中删除曲目

**GET /api/users/:userId/playlists** - 获取用户创建的歌单。`userId` 可以是 `current`

### 收藏的歌单

**GET /api/users/:userId/favoritePlaylists** - 获取用户收藏的歌单

**POST/DELETE /api/playlists/:playlistId/favorite** - 收藏/取消收藏歌单

### 收藏的曲目

**GET /api/users/:userId/favorites** - 获取用户的收藏列表。`userId` 可以是 `current`

**POST/api/favorites body: trackId** - 收藏曲目

**DELETE /api/favorites/:trackId** - 取消收藏曲目

### 曲目

**GET /api/tracks/:trackId?** - 获取曲目信息

**POST /api/tracks body: trackId** - 上传曲目。需要管理员权限

**PUT /api/tracks/:trackId body: trackId** - 更新曲目。需要管理员权限

**DELETE /api/tracks/:trackId** - 删除曲目。需要管理员权限

### 评论

**GET /api/tracks/:trackId/comments** - 获取曲目的评论

**POST /api/tracks/:trackId/comments** - 发布对曲目的评论

### 云盘

**GET /api/drive** - 获取用户云盘中的曲目

**POST /api/drive** - 上传曲目到用户云盘

**DELETE /api/drive/:trackId** - 从用户云盘中删除曲目

### 搜索

**GET /api/search ?q=** - 搜索曲目和用户

### 动态

**GET /api/posts** - 获取关注用户的动态

**GET /api/users/:userId/posts** - 获取用户的动态

**POST /api/posts body: postId** - 发送动态

**DELETE /api/posts/:postId** - 删除动态

### 聊天

**GET /api/messages** - 获取与当前用户有消息往来的用户（名字，头像）

**GET /api/messages/:partnerUserId** - 获取用户与伙伴之间的消息

</details>
