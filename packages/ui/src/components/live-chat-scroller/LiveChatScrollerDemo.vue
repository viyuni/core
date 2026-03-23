<template>
  <div class="demo-container">
    <div class="stream-widget">
      <LiveChatScroller ref="messageLayerRef" :max-items="30" item-key="msgId">
        <template #item="{ data }">
          <div
            v-if="data.type === 'chat'"
            class="chat-ui"
            :class="{ 'is-censored': data.isCensored }"
          >
            <span class="badge" v-if="data.isFan">粉丝</span>
            <span class="uname">{{ data.username }}:</span>

            <span v-if="data.isCensored" class="text censored-text">{{ data.content }}</span>
            <span v-else class="text">{{ data.content }}</span>

            <span v-if="data.likes > 0" class="likes-tag"> ❤️ {{ data.likes }} </span>
          </div>

          <div v-else-if="data.type === 'gift'" class="gift-ui">
            🎉 <span class="uname">{{ data.username }}</span> 赠送了
            <span class="gift-name">{{ data.giftName }}</span> x {{ data.count }}!
          </div>
        </template>
      </LiveChatScroller>
    </div>

    <div class="control-panel">
      <h3>🚀 弹幕引擎压测面板</h3>
      <p>正在模拟直播间高频数据交互...</p>
      <ul>
        <li>✅ 每 400ms 推送一条普通弹幕</li>
        <li>✅ 随机触发“土豪刷礼物”</li>
        <li>✅ 随机触发 Patch: 动态点赞 (+1)</li>
        <li>✅ 随机触发 Patch: 房管屏蔽 (修改文字和样式)</li>
      </ul>
      <button @click="clearMessages">清空屏幕</button>
      <button @click="stop">Stop</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef } from 'vue';

import { createLiveChatScroller } from './index';

// ================= 类型定义 =================
interface BaseMessage {
  msgId: string;
  username: string;
}
interface ChatMessage extends BaseMessage {
  type: 'chat';
  content: string;
  isFan: boolean;
  likes: number; // 点赞数
  isCensored: boolean; // 是否被屏蔽
}
interface GiftMessage extends BaseMessage {
  type: 'gift';
  giftName: string;
  count: number;
}


type StreamMessage = ChatMessage | GiftMessage;


const LiveChatScroller = createLiveChatScroller<StreamMessage>();


// ================= 组件与状态 =================
const messageLayerRef = useTemplateRef('messageLayerRef');


// 用来保存最近发出的消息 ID，方便我们后续模拟随机打补丁
const recentChatIds: string[] = [];
const timers: ReturnType<typeof setInterval>[] = [];


// ================= 模拟推流与打补丁 =================
onMounted(() => {
  // 1. 模拟常规弹幕流 (推流)
  const chatTimer = setInterval(() => {
    const id = 'msg_' + Date.now() + Math.floor(Math.random() * 1000);
    const mockContent = [
      '主播牛逼！',
      '666666',
      '这波操作太细了，学到了学到了',
      '前面的等等我',
      '2333',
    ];

    recentChatIds.push(id);
    if (recentChatIds.length > 50) recentChatIds.shift(); // 维护最新的50个ID用来测试

    messageLayerRef.value?.push({
      msgId: id,
      type: 'chat',
      username: '用户_' + Math.floor(Math.random() * 1000),
      content: mockContent[Math.floor(Math.random() * mockContent.length)]!,
      isFan: Math.random() > 0.5,
      likes: 0,
      isCensored: false,
    });
  }, 1000);

  // 2. 模拟土豪狂刷礼物 (推流)
  const giftTimer = setInterval(() => {
    if (Math.random() > 0.7) {
      // 30% 概率出礼物
      messageLayerRef.value?.push({
        msgId: 'gift_' + Date.now(),
        type: 'gift',
        username: '王总',
        giftName: '超级火箭',
        count: 1,
      });
    }
  }, 3000);

  // 3. 模拟动态点赞 (打补丁)
  const likeTimer = setInterval(() => {
    if (recentChatIds.length === 0) return;
    // 随机挑一个幸运观众点赞
    const targetId = recentChatIds[Math.floor(Math.random() * recentChatIds.length)]!;

    messageLayerRef.value?.patch((item) => {
      if (item.msgId === targetId && item.type === 'chat') {
        return { ...item, likes: item.likes + 1 };
      }
    });
  }, 1000); // 每 800ms 随机点个赞

  // 4. 模拟房管违规屏蔽 (打补丁 - 长度变化测试引擎滑动是否平滑)
  const censorTimer = setInterval(() => {
    if (recentChatIds.length === 0 || Math.random() > 0.3) return; // 概率触发

    const targetId = recentChatIds[Math.floor(Math.random() * recentChatIds.length)];

    messageLayerRef.value?.patch((item) => {
      if (item.msgId === targetId && item.type === 'chat')
        return {
          ...item,
          isCensored: true,
          content: '***该条消息涉嫌违规，已被房管屏蔽***',
        };
    });
  }, 2000); // 每5秒有概率封禁一条

  timers.push(chatTimer, giftTimer, likeTimer, censorTimer);
});


onBeforeUnmount(() => {
  timers.forEach(clearInterval);
});


function stop() {
  timers.forEach(clearInterval);
}


// 手动清屏
const clearMessages = () => {
  messageLayerRef.value?.clear();
  recentChatIds.length = 0;
};
</script>

<style scoped>
/* ================= 页面整体布局 ================= */
.demo-container {
  display: flex;
  gap: 40px;
  padding: 40px;
  min-height: 100vh;
  font-family: sans-serif;
  color: #fff;
}

/* ================= 模拟 OBS 直播源挂件 ================= */
.stream-widget {
  width: 350px;
  height: 600px;
  background-color: rgba(255, 255, 255, 0.05);
  /* 稍微给点底色方便看范围，实际OBS里可设为 transparent */
  border: 1px dashed #666;
  border-radius: 12px;
  padding: 15px;
  box-sizing: border-box;
}

/* ================= 业务 UI 样式 ================= */
.chat-ui {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
  border-left: 3px solid transparent;
  transition: all 0.3s;
}

.chat-ui.is-censored {
  border-left-color: #ff4757;
  background: rgba(255, 71, 87, 0.1);
}

.badge {
  background: #ff74a4;
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 6px;
}

.uname {
  color: #00d8ff;
  font-weight: bold;
  margin-right: 6px;
}

.censored-text {
  color: #ff4757;
  font-style: italic;
}

.likes-tag {
  display: inline-block;
  margin-left: 8px;
  background: rgba(255, 116, 164, 0.2);
  color: #ff74a4;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.gift-ui {
  background: linear-gradient(90deg, rgba(255, 116, 164, 0.85), rgba(0, 0, 0, 0));
  color: white;
  padding: 12px 15px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 15px;
  border-left: 3px solid #ff74a4;
}

.gift-name {
  color: #ffe200;
  font-size: 18px;
  margin: 0 4px;
}

/* ================= 操作面板样式 ================= */
.control-panel {
  width: 300px;
  height: fit-content;
  background: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
}

.control-panel h3 {
  margin-top: 0;
  color: #00d8ff;
}

.control-panel ul {
  padding-left: 20px;
  line-height: 1.8;
  color: #ccc;
}

.control-panel button {
  background: #ff4757;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  margin-top: 20px;
  transition: opacity 0.2s;
}

.control-panel button:hover {
  opacity: 0.8;
}
</style>
