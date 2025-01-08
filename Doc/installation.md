# Kong API Gateway 环境搭建手顺

## 环境要求

- Windows 10/11
- Docker Desktop for Windows
- Git（可选，用于克隆配置文件）

## 安装步骤

### 1. 准备 Docker 环境

1. 确保 Docker Desktop 已安装并正常运行
   ```bash
   docker --version
   docker-compose --version
   ```

### 2. 创建 Docker Compose 配置

1. 创建项目目录并进入

   ```bash
   mkdir kong-learning
   cd kong-learning
   ```

2. 创建 `docker-compose.yml` 文件，内容如下：

   ```yaml
   version: "3.8"

   services:
     kong-database:
       image: postgres:13
       container_name: kong-database
       environment:
         POSTGRES_USER: kong
         POSTGRES_DB: kong
         POSTGRES_PASSWORD: kongpass
       ports:
         - "5432:5432"
       healthcheck:
         test: ["CMD", "pg_isready", "-U", "kong"]
         interval: 5s
         timeout: 5s
         retries: 5

     kong-migration:
       image: kong:latest
       command: kong migrations bootstrap
       depends_on:
         - kong-database
       environment:
         KONG_DATABASE: postgres
         KONG_PG_HOST: kong-database
         KONG_PG_USER: kong
         KONG_PG_PASSWORD: kongpass

     kong:
       image: kong:latest
       container_name: kong
       environment:
         KONG_DATABASE: postgres
         KONG_PG_HOST: kong-database
         KONG_PG_USER: kong
         KONG_PG_PASSWORD: kongpass
         KONG_PROXY_ACCESS_LOG: /dev/stdout
         KONG_ADMIN_ACCESS_LOG: /dev/stdout
         KONG_PROXY_ERROR_LOG: /dev/stderr
         KONG_ADMIN_ERROR_LOG: /dev/stderr
         KONG_ADMIN_LISTEN: 0.0.0.0:8001
         KONG_PROXY_LISTEN: 0.0.0.0:8000
       ports:
         - "8000:8000"
         - "8001:8001"
       depends_on:
         - kong-migration
   ```

### 3. 启动 Kong

1. 启动所有服务

   ```bash
   docker-compose up -d
   ```

2. 验证服务状态
   ```bash
   docker-compose ps
   ```

### 4. 验证安装

1. 测试 Kong Admin API 是否可访问

   - 打开浏览器访问: http://localhost:8001
   - 或使用命令行：
     ```bash
     curl http://localhost:8001
     ```

2. 测试 Kong Proxy 端口
   ```bash
   curl http://localhost:8000
   ```

## 端口说明

- 8000: Kong Proxy 端口（用于处理 API 请求）
- 8001: Kong Admin API 端口（用于管理 Kong）
- 5432: PostgreSQL 数据库端口

## 常见问题处理

1. Docker 服务无法启动

   - 检查 Docker Desktop 是否正常运行
   - 检查 Windows WSL 2 是否正常

2. 端口冲突问题

   - 检查 8000, 8001, 5432 端口是否被占用
   - 如被占用，可在 docker-compose.yml 中修改端口映射

3. 数据库连接失败
   - 检查 PostgreSQL 容器是否正常运行
   - 查看容器日志：
     ```bash
     docker-compose logs kong-database
     ```

## 环境清理

如需完全清理环境：

- 停止并删除所有容器

```bash
docker-compose down
```

- 如果需要删除数据卷

```bash
docker-compose down -v
```

## 下一步

环境搭建完成后，您可以：

1. 开始创建您的第一个服务和路由
2. 尝试配置基本插件
3. 测试 API 代理功能

## 参考链接

- [Kong 官方安装文档](https://docs.konghq.com/gateway/latest/install/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
