# Kong API Gateway 学习项目

## 项目基本信息

- 项目目的：学习和验证 Kong API Gateway 的核心功能
- 项目范围：专注于 Kong API Gateway 的基础功能验证
- 验证环境：本地开发环境

## 学习前提条件

1. Docker 环境（用于运行 Kong 和数据库）
2. 基本的 API 和 HTTP 协议知识
3. 命令行操作基础

## 学习步骤

1. Kong 环境搭建

   - [环境搭建详细步骤](./installation.md)
   - 使用 Docker Compose 部署 Kong
   - 配置 PostgreSQL 数据库
   - 验证 Kong Admin API 可访问性

2. Kong 基础概念学习

   - Routes（路由）
   - Services（服务）
   - Consumers（消费者）
   - Plugins（插件）

3. 实践验证
   - 基础路由配置
   - 服务注册
   - 插件使用

## 主要验证功能

1. 核心功能

   - API 路由和代理
   - 请求/响应转换
   - 流量控制

2. 安全功能

   - 身份认证（Key Auth）
   - 访问控制（ACL）
   - 速率限制（Rate Limiting）

3. 可观测性
   - 基础监控
   - 访问日志

## 参考资料

- [Kong 官方文档](https://docs.konghq.com/)
- [Kong Gateway OSS 文档](https://docs.konghq.com/gateway/latest/)
- [Kong GitHub 仓库](https://github.com/Kong/kong)
- [Kong 讨论社区](https://discuss.konghq.com/)

## 注意事项

- 本项目聚焦于 Kong API Gateway 的核心功能验证
- 采用最新稳定版本的 Kong Gateway OSS（开源版本）
- 优先使用 Docker 方式部署以简化环境配置
