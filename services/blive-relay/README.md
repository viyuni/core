# @viyuni/blive-relay

Bilibili 直播间弹幕中继服务，将 B站弹幕事件转发到内部系统。

## 功能特性

- 🎯 连接多个 B站直播间，实时接收弹幕事件
- 🔄 自动解析弹幕事件（已实现：DANMU_MSG、SEND_GIFT、USER_TOAST_MSG_V2）
- 💾 持久化存储事件到 PostgreSQL
- 🔌 WebSocket 推送解析后的事件到客户端
- 🔄 自动刷新 cookie，保持连接稳定
- 🛡️ WebSocket 访问令牌认证

## 技术栈

- **@viyuni/blive-ws** - B站直播间连接库
- **Elysia** - Web 框架
- **Drizzle ORM** - 数据库 ORM
- **PostgreSQL** - 数据库

## 环境变量

```bash
# 数据库连接
DATABASE_URL=postgresql://user:password@localhost:5432/viyuni

# Cookie 同步服务
LOGIN_SYNC_URL=http://localhost:3000
LOGIN_SYNC_PASSWORD=your-password

# WebSocket 访问令牌（可选）
ACCESS_TOKEN=your-access-token-min-16-chars

# 监听的房间 ID 列表
ROOMS=[123456,789012]
```

## 快速开始

### 1. 安装依赖

```bash
bun install
```

### 2. 配置环境变量

复制 `.env` 文件并配置：

```bash
cp .env.example .env
```

### 3. 运行数据库迁移

```bash
bun run db:generate  # 生成迁移文件
bun run db:migrate   # 执行迁移
```

### 4. 启动服务

```bash
bun run dev
```

或使用监听模式：

```bash
bun run dev:watch
```

## API 接口

### GET /events

查询事件列表。

**查询参数：**

- `limit` - 每页数量（默认：50）
- `offset` - 偏移量（默认：0）
- `cmd` - 按命令筛选
- `createdAt` - 按时间筛选

**响应示例：**

```json
{
  "total": 1000,
  "limit": 50,
  "offset": 0,
  "data": [...]
}
```

### WebSocket /ws

连接 WebSocket 接收实时事件推送。

**查询参数：**

- `accessToken` - 订阅令牌（如果配置了 ACCESS_TOKEN）

**连接示例：**

```javascript
const ws = new WebSocket('ws://localhost:6300/ws?accessToken=your-token');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('收到事件:', data);
};
```

## 数据库表结构

### events_table

存储已解析的事件数据。

### unknown_events_table

存储未知或未实现的事件数据。

## 事件分发

服务会将事件分为三类：

1. **已解析事件** - 调用对应解析器，保存到 `events_table`
2. **未实现事件** - 在 Cmd 枚举中但无解析器，保存到 `unknown_events_table`
3. **未知事件** - 不在 Cmd 枚举中的新事件，保存到 `unknown_events_table`

## 开发

```bash
# 数据库管理
bun run db:generate  # 生成迁移文件
bun run db:migrate   # 执行迁移
bun run db:studio    # 打开 Drizzle Studio

# 运行服务
bun run dev          # 启动服务
bun run dev:watch    # 监听模式
```

## 许可证

MIT
