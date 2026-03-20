# 事件发布系统

系统中的所有事件都会被包装成统一格式，便于区分来源和处理。

## 事件格式

```typescript
interface WrappedEvent<T = ViyuniEvent> {
  source: 'bilibili' | 'system'; // 事件来源
  event: T; // 原始事件数据
  timestamp: string; // 事件时间戳（ISO 8601）
}
```

## 事件来源

### 1. B站事件（source: 'bilibili'）

从 B站直播间监听到的真实事件，包括：

- 弹幕消息（DANMU_MSG）
- 礼物（SEND_GIFT）
- 进入房间（INTERACT_WORD）
- 等等...

**示例：**

```json
{
  "source": "bilibili",
  "event": {
    "cmd": "DANMU_MSG",
    "id": "xxx",
    "content": "hello",
    ...
  },
  "timestamp": "2025-03-20T12:34:56.789Z"
}
```

### 2. 系统事件（source: 'system'）

由系统内部生成的事件，例如：

- 系统通知
- 定时任务
- 管理操作
- 等等...

**示例：**

```json
{
  "source": "system",
  "event": {
    "cmd": "SYSTEM_NOTICE",
    "message": "Cookie 已更新",
    ...
  },
  "timestamp": "2025-03-20T12:34:56.789Z"
}
```

## 使用方法

### 1. 发布 B站事件（自动）

B站事件会通过 `listener-manager` 自动发布，无需手动处理：

```typescript
// services/listener-manager.ts
listener.on('event', async (event) => {
  await insertEvent(roomId, event);
  publishBilibiliEvent(event); // 自动包装并发布
});
```

### 2. 发布系统事件

使用 `publishSystemEvent` 函数：

```typescript
import { publishSystemEvent } from './services/event-publisher';

// 发布系统通知
publishSystemEvent('SYSTEM_NOTICE', {
  message: 'Cookie 已更新',
  level: 'info',
});

// 发布定时任务结果
publishSystemEvent('CRON_JOB_COMPLETED', {
  jobName: 'cookie_refresh',
  success: true,
  duration: 1234,
});
```

### 3. 自定义事件发布

使用 `publishEvent` 函数手动指定来源：

```typescript
import { publishEvent } from './services/event-publisher';

// 发布带来源的事件
publishEvent('system', 'CUSTOM_EVENT', {
  foo: 'bar',
});

// 或发布 B站格式的事件
publishEvent('bilibili', 'DANMU_MSG', {
  id: 'xxx',
  content: 'test',
});
```

## WebSocket 接收示例

客户端连接 WebSocket 后会收到包装后的事件：

```javascript
const ws = new WebSocket('ws://localhost:3600');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.source === 'bilibili') {
    console.log('来自 B站的事件:', data.event);
    // 处理 B站事件
  } else if (data.source === 'system') {
    console.log('系统事件:', data.event);
    // 处理系统事件
  }

  console.log('事件时间:', new Date(data.timestamp));
};
```

## 类型定义

所有类型都已导出，可以在其他模块中使用：

```typescript
import type { WrappedEvent, EventSource } from './services/event-publisher';

function handleEvent(wrapped: WrappedEvent) {
  if (wrapped.source === 'bilibili') {
    // 处理 B站事件
  }
}
```

## 注意事项

1. **只读字段**：`source` 和 `timestamp` 由系统自动设置，不要手动修改
2. **事件 cmd**：系统事件的 cmd 可以自定义，建议使用 `SYSTEM_*` 前缀
3. **时间戳**：使用 ISO 8601 格式，便于跨平台处理
