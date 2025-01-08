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
