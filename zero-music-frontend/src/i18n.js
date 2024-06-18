import i18n from "i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
// import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";

const fallbackLng = ["en"];

i18n
  // .use(Backend) // used to load data from othe directory
  // .use(LanguageDetector) // detects the current language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng, // default language
    detection: {
      checkWhitelist: true,
    },
    debug: false,
    interpolation: {
      escapeValue: false, // no need for react. it escapes by default
    },
    // backend: {
    //   loadPath: "/locales/{{lng}}/translation.json",
    // },
    resources: {
      "zh-CN": {
        translation: {
          "searchPrompt": "发现音乐或用户",
          "personalProfile": "个人主页",
          "updateInfo": "更新信息",
          "logout": "退出登录",
          "login": "登录",
          "register": "注册",
          "homepage": "首页",
          "userLogin": "用户登录",
          "username": "用户名",
          "password": "密码",
          "newUserRegister": "新用户注册",
          "avatar": "头像",
          "name": "昵称",
          "changeAvatar": "更换头像",

          "my": "我的",
          "myFavorites": "我的收藏",
          "myPlaylists": "我的歌单",
          "myDrive": "我的云盘",
          "community": "社区",
          "posts": "动态",
          "messages": "私信",
          "manageTracks": "管理曲库",

          "musicRecommendation": "音乐推荐",
          "playPlaylist": "播放歌单",
          "addToPlaylist": "添加到歌单",
          "newPlaylist": "新建歌单",
          "managePlaylists": "管理歌单",
          "finish": "完成",
          "playlistName": "歌单名",
          "cover": "封面",
          "upload": "上传",
          "playDrive": "播放云盘",
          "manageDrive": "管理云盘",
          "uploadMusic": "上传音乐",
          "musicTitle": "歌曲名",
          "artist": "歌手",
          "changeCover": "更换封面",
          "musicFile": "音乐文件",
          "driveManagement": "云盘管理",
          "edit": "编辑",
          "delete": "删除",

          "friendsPosts": "好友动态",
          "newPost": "发表动态",
          "myPosts": "我的动态",
          "postContentPrompt": "想说点什么？",
          "postSelectMusic": "带上音乐",
          "cancel": "取消",
          "post": "发表",

          "messageList": "消息列表",
          "sendMessage": "发送",
          "following": "关注",
          "follow": "关注",
          "followed": "已关注",
          "unfollow": "取消关注",
          "followers": "粉丝",
          "privateMessage": "私信",
          "favorites": "收藏",
          "playlists": "歌单",

          "nullPlaylist": "播放列表为空",
          "editPlaylist": "编辑歌单",
          "update": "更新",

          "registerSuccess": "注册成功，请登录",
          "usernameExists": "用户名已被注册",
          "incorrectUsername": "用户名错误",
          "incorrectPassword": "密码错误",
          "loginFailed": "登录失败",

          "lyrics": "歌词",
          "noLyrics": "暂无歌词",
          "comments": "评论",
          "noComments": "暂无评论",
          "typeComment": "输入评论...",

          "searchResults": "搜索结果",
          "music": "音乐",
          "users": "用户",

          "musicManagement": "音乐管理",
        }
      },
      en: {
        translation: {
          "searchPrompt": "Discover music or users",
          "personalProfile": "Personal Profile",
          "updateInfo": "Update Profile",
          "logout": "Sign Out",
          "login": "Sign In",
          "register": "Register",
          "homepage": "Home",
          "userLogin": "User Login",
          "username": "Username",
          "password": "Password",
          "newUserRegister": "New User Register",
          "avatar": "Avatar",
          "name": "Name",
          "changeAvatar": "Change Avatar",

          "my": "My",
          "myFavorites": "Favorites",
          "myPlaylists": "Playlists",
          "myDrive": "Cloud Drive",
          "community": "Community",
          "posts": "Posts",
          "messages": "Messages",
          "manageTracks": "Manage Tracks",

          "musicRecommendation": "Music Recommendation",
          "playPlaylist": "Play",
          "addToPlaylist": "Add to Playlist",
          "newPlaylist": "New Playlist",
          "managePlaylists": "Manage Playlists",
          "finish": "Finish",
          "playlistName": "Playlist Name",
          "cover": "Cover",
          "upload": "Upload",
          "playDrive": "Play Drive",
          "manageDrive": "Manage Drive",
          "uploadMusic": "Upload Music",
          "musicTitle": "Music Title",
          "artist": "Artist",
          "changeCover": "Change Cover",
          "musicFile": "Music File",
          "driveManagement": "Drive Management",
          "edit": "Edit",
          "delete": "Delete",

          "friendsPosts": "Friends' Posts",
          "newPost": "New Post",
          "myPosts": "My Posts",
          "postContentPrompt": "Want to say something?",
          "postSelectMusic": "Also Include Music?",
          "cancel": "Cancel",
          "post": "Post",

          "messageList": "Message List",
          "sendMessage": "Send",
          "following": "Following",
          "follow": "Follow",
          "followed": "Followed",
          "unfollow": "Unfollow",
          "followers": "Followers",
          "privateMessage": "Private Message",
          "favorites": "Favorites",
          "playlists": "Playlists",

          "nullPlaylist": "Playlist is empty",
          "editPlaylist": "Edit Playlist",
          "update": "Update",

          "registerSuccess": "Registration successful, please log in",
          "usernameExists": "Username already exists",
          "incorrectUsername": "Incorrect username",
          "incorrectPassword": "Incorrect password",
          "loginFailed": "Login failed",

          "lyrics": "Lyrics",
          "noLyrics": "No lyrics available",
          "comments": "Comments",
          "noComments": "No comments available",
          "typeComment": "Type a comment...",

          "searchResults": "Search Results",
          "music": "Music",
          "users": "Users",

          "musicManagement": "Music Management",
        }
      }
    }
  });

export default i18n;