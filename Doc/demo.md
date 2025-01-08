# Kong API Gateway 功能验证指南

本指南将帮助你验证 Kong API Gateway 的各项核心功能。我们将使用一个简单的测试应用来演示 Kong 的关键特性。

## 1. 测试应用准备

我们将使用一个简单的 Node.js Express 应用作为后端服务，提供基本的 REST API 接口。

### 1.1 创建测试应用

创建 `test-api` 目录并初始化应用：

```bash
mkdir test-api
cd test-api
npm init -y
npm install express
```

创建 `app.js`：

```javascript
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// 基础信息接口
app.get("/info", (req, res) => {
  res.json({
    message: "Hello from Test API",
    timestamp: new Date(),
    headers: req.headers,
  });
});

// 模拟用户数据接口
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
  ]);
});

// 回显请求数据接口
app.post("/echo", (req, res) => {
  res.json({
    receivedData: req.body,
    headers: req.headers,
  });
});

app.listen(port, () => {
  console.log(`Test API running at http://localhost:${port}`);
});
```

### 1.2 使用 Docker 运行测试应用

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

添加到 docker-compose.yml：

```yaml
test-api:
  build: ./test-api
  container_name: test-api
  ports:
    - "3000:3000"
  networks:
    - kong-net
```

## 2. Kong 配置验证

### 2.1 基本路由配置

1. 创建服务：

```bash
curl -i -X POST http://localhost:8001/services \
  --data "name=test-api" \
  --data "url=http://test-api:3000"
```

2. 创建路由：

```bash
curl -i -X POST http://localhost:8001/services/test-api/routes \
  --data "name=test-api-route" \
  --data "paths[]=/api"
```

3. 测试访问：

```bash
curl http://localhost:8000/api/info
```

### 2.2 身份验证配置

1. 启用 key-auth 插件：

```bash
curl -i -X POST http://localhost:8001/services/test-api/plugins \
  --data "name=key-auth"
```

2. 创建消费者：

```bash
curl -i -X POST http://localhost:8001/consumers \
  --data "username=demo-user"
```

3. 创建 API key：

```bash
curl -i -X POST http://localhost:8001/consumers/demo-user/key-auth \
  --data "key=your-api-key"
```

4. 测试带认证的访问：

```bash
curl http://localhost:8000/api/info \
  -H "apikey: your-api-key"
```

### 2.3 速率限制配置

1. 启用 rate-limiting 插件：

```bash
curl -i -X POST http://localhost:8001/services/test-api/plugins \
  --data "name=rate-limiting" \
  --data "config.minute=5" \
  --data "config.hour=100"
```

2. 测试速率限制：

```bash
# 连续发送请求查看限制效果
for i in {1..10}; do
  curl -i http://localhost:8000/api/info -H "apikey: your-api-key"
  sleep 1
done
```

### 2.4 请求转换配置

1. 启用 request-transformer 插件：

```bash
curl -i -X POST http://localhost:8001/services/test-api/plugins \
  --data "name=request-transformer" \
  --data "config.add.headers[]=X-Custom-Header:demo"
```

2. 测试请求转换：

```bash
curl -i http://localhost:8000/api/info -H "apikey: your-api-key"
```

## 3. 高级功能验证

### 3.1 负载均衡

1. 创建多个测试应用实例：

```yaml
test-api-1:
  build: ./test-api
  environment:
    - SERVER_ID=1
test-api-2:
  build: ./test-api
  environment:
    - SERVER_ID=2
```

2. 配置上游服务：

```bash
curl -i -X POST http://localhost:8001/upstreams \
  --data "name=test-api-upstream"

curl -i -X POST http://localhost:8001/upstreams/test-api-upstream/targets \
  --data "target=test-api-1:3000"
curl -i -X POST http://localhost:8001/upstreams/test-api-upstream/targets \
  --data "target=test-api-2:3000"
```

### 3.2 健康检查

1. 配置健康检查：

```bash
curl -i -X POST http://localhost:8001/upstreams/test-api-upstream \
  --data "healthchecks.active.healthy.interval=5" \
  --data "healthchecks.active.unhealthy.interval=5"
```

### 3.3 监控

1. 启用 Prometheus 插件：

```bash
curl -i -X POST http://localhost:8001/plugins \
  --data "name=prometheus"
```

2. 访问指标：

```bash
curl http://localhost:8001/metrics
```

## 4. 常见问题处理

### 4.1 连接问题

- 确保所有服务都在同一个 Docker 网络中
- 检查容器日志：`docker-compose logs [service-name]`
- 验证服务健康状态：`curl http://localhost:8001/status`

### 4.2 认证问题

- 确认 API key 是否正确
- 检查认证插件配置
- 查看 Kong 错误日志

### 4.3 性能问题

- 检查速率限制配置
- 监控服务响应时间
- 查看资源使用情况

## 5. 下一步

完成基本功能验证后，你可以：

1. 探索更多 Kong 插件
2. 配置 SSL/TLS
3. 设置 API 文档（使用 Swagger/OpenAPI）
4. 实现更复杂的认证方案（OAuth2、JWT）
5. 配置监控和告警
