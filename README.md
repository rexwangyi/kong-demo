# Kong API Gateway Demo

这是一个 Kong API Gateway 的示例项目，展示了如何使用 Kong 进行 API 管理和测试。

## 项目结构

```
.
├── Doc/                    # 文档目录
│   ├── installation.md     # 安装指南
│   ├── demo.md            # 功能演示文档
│   ├── postman_guide.md   # Postman 测试指南
│   └── postman_collection.json  # Postman 测试集合
├── test-api/              # 测试 API 服务
│   ├── app.js            # API 服务主文件
│   ├── package.json      # Node.js 项目配置
│   └── Dockerfile        # API 服务容器配置
└── docker-compose.yml     # Docker 编排配置文件
```

## 功能特性

- Kong API Gateway 基础配置
- 测试 API 服务（Node.js + Express）
- API 认证（Key Authentication）
- 请求速率限制
- 请求转换
- Postman 测试集合

## 快速开始

1. 克隆仓库：

   ```bash
   git clone https://github.com/rexwangyi/kong-demo.git
   cd kong-demo
   ```

2. 启动服务：

   ```bash
   docker-compose up -d
   ```

3. 验证安装：
   ```bash
   curl http://localhost:8001
   ```

详细说明请参考 [安装指南](Doc/installation.md)。

## 测试指南

1. 导入 Postman 测试集合（位于 `Doc/postman_collection.json`）
2. 按照 [Postman 测试指南](Doc/postman_guide.md) 进行测试

## 主要端口

- 8000: Kong Proxy
- 8001: Kong Admin API
- 3000: 测试 API 服务
- 5432: PostgreSQL 数据库

## 文档

- [安装指南](Doc/installation.md)
- [功能演示](Doc/demo.md)
- [Postman 测试指南](Doc/postman_guide.md)

## 许可证

MIT
