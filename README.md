<p align="center"><a href="https://easy-mock.com" target="_blank"></a></p>

<p align="center">
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D8.9.1-green.svg?style=flat" alt="Node.js Version"></a>
  <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/mongo-%3E%3D3.4.1-green.svg?style=flat" alt="MongoDB Version"></a>
  <a href="https://redis.io"><img src="https://img.shields.io/badge/redis-%3E%3D4.0-green.svg?style=flat" alt="Redis Version"></a>
  <a href="https://circleci.com/gh/easy-mock/easy-mock/tree/dev"><img src="https://circleci.com/gh/easy-mock/easy-mock/tree/dev.svg?style=svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/easy-mock/easy-mock?branch=dev"><img src="https://img.shields.io/codecov/c/github/easy-mock/easy-mock/dev.svg" alt="Coverage Status"></a>
  <a href="http://standardjs.com"><img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="js-standard-style"></a>
  <a href="https://opensource.org/licenses/GPL-3.0"><img src="https://img.shields.io/badge/license-GPL--3.0-blue.svg" alt="License"></a>
  <a href="https://discord.gg/DdhQnaS"><img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg" alt="Chat"></a>
</p>

## 介绍

本项目主要是通过<a href="https://www.tslang.cn" target="_blank">Typescript</a>、<a href="https://cli.vuejs.org" target="_blank">Vue3.0 Cli</a>对<a href="https://easy-mock.com" target="_blank">Easy Mock</a>进行重构，主要是为了熟悉通过<a href="https://www.tslang.cn" target="_blank">Typescript</a>编写VUE,此仓库为client，搭配<a href="https://github.com/chenkaibo1/mock-server.git" target="_blank">mock-server</a>一起使用
Easy Mock 是一个可视化，并且能快速生成**模拟数据**的持久化服务。

## 特性

- 支持接口代理
- 支持快捷键操作
- 支持协同编辑
- 支持团队项目
- 支持 RESTful
- 支持 [Swagger](https://swagger.io) | OpenAPI Specification ([1.2](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/1.2.md) & [2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) & [3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md))
  - 基于 Swagger 快速创建项目
  - 支持显示接口入参与返回值
  - 支持显示实体类
- 支持灵活性与扩展性更高的响应式数据开发
- 支持自定义响应配置（例：status/headers/cookies）
- 支持 [Mock.js](http://mockjs.com/) 语法
- 支持 [restc](https://github.com/ElemeFE/restc) 方式的接口预览

## 链接

- [在线使用文档](https://easy-mock.com/docs)
- [Easy Mock CLI](https://github.com/easy-mock/easy-mock-cli) - 基于 Easy Mock 快速生成 api.js 的命令行工具。

## 快速开始

> 在开始之前，假设你已经成功安装了 [Node.js](https://nodejs.org)（**v8.x, ~~不支持 v10.x~~**）& [MongoDB](https://www.mongodb.com)（**>= v3.4**）& [Redis](https://redis.io)（**>= v4.0**）。

### 安装

```sh
$ git clone https://github.com/chenkaibo1/mock-client.git
$ cd mock-client && yarn
```

**背景图配置：**

登录页的背景图服务目前支持 [Unsplash](https://unsplash.com/developers) 与 [Bing](http://bing.com)。

如果 `unsplashClientId` 配置留空，默认由 Bing 提供服务。


### 启动

```sh
$ yarn run dev
# 访问 http://127.0.0.1:7300
```

## 更多命令

```sh
# 前端静态资源构建打包
$ npm run build

```

## 服务器部署

> 在此之前请先配置好配置文件。

### PM2

当在内网服务器部署时，推荐使用 [PM2](https://github.com/Unitech/pm2) 来守护你的应用进程。

#### 全局安装 PM2

```sh
$ [sudo] npm install pm2 -g
```

#### 用 PM2 启动

> 在此之前，你应该已经完成了 build。

```sh
$ NODE_ENV=production pm2 start app.js
```

## License
