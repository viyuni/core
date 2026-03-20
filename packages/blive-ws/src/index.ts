import { EventEmitter } from 'events';

import { Cmd, type ViyuniEvent } from '@viyuni/event-types';
import { KeepLiveTCP } from 'bilibili-live-ws';
import { parseCookie } from 'cookie';

import { fetchDanmuInfo, fetchNavInfo } from './bili-api';
import { parsers } from './parsers';
export * from './parsers';

type ListenerEvents = {
  unknownEvent: (event: Record<string, unknown> | unknown[]) => void;
  unimplementedEvent: (cmd: Cmd, raw: Record<string, unknown>) => void;
  event: (event: ViyuniEvent) => void;
};

export interface ListenerConfig {
  roomId: number;
  cookie: string;
}

class BliveListener {
  private ws: KeepLiveTCP | null = null;
  private roomId: number;
  private emitter = new EventEmitter();
  private cookie = '';
  private buvid = '';
  private uid = 0;

  constructor(config: ListenerConfig) {
    this.roomId = config.roomId;
    this.cookie = config.cookie;
    this.buvid = this.extractBuvid(config.cookie);
  }

  private extractBuvid(cookie: string): string {
    const cookies = parseCookie(cookie);
    return cookies.buvid3 ?? '';
  }

  updateCookie(newCookie: string) {
    this.cookie = newCookie;
    this.buvid = this.extractBuvid(newCookie);
  }

  async updateCookieAndRestart(newCookie: string) {
    if (newCookie === this.cookie) {
      return;
    }

    this.updateCookie(newCookie);
    await this.start();
  }

  async start() {
    if (this.ws) this.stop();

    const [{ mid = 0 }, { randomServer, token }] = await Promise.all([
      fetchNavInfo(this.cookie),
      fetchDanmuInfo(this.roomId, this.cookie),
    ]);

    this.uid = mid;
    if (mid === 0) console.warn('Viyuni Sync account not logged in.');

    this.ws = new KeepLiveTCP(this.roomId, {
      host: randomServer?.host,
      port: randomServer?.port,
      key: token,
      uid: this.uid ?? 0,
      buvid: this.buvid ?? '',
    });

    this.ws.addListener('msg', (msg) => this.handleMsg(msg));
    this.ws.addListener('close', () => console.log(`${this.roomId} 连接已关闭...`));
    this.ws.addListener('error', (err) => console.error('连接错误:', err));
  }

  /** 停止监听 */
  stop() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /** 获取当前房间号 */
  getRoomId() {
    return this.roomId;
  }

  /** 事件监听 */
  on<E extends keyof ListenerEvents>(event: E, callback: ListenerEvents[E]) {
    this.emitter.on(event, callback);
    return () => this.emitter.off(event, callback);
  }

  private handleMsg(msg: any) {
    const cmd = msg?.cmd as Cmd | undefined;

    if (!cmd) return;

    const isKnownCmd = Object.values(Cmd).includes(cmd);

    if (!isKnownCmd) {
      this.emitter.emit('unknownEvent', msg);
      return;
    }

    const parser = parsers.find((parser) => parser.cmd === cmd)?.parser;

    if (!parser) {
      this.emitter.emit('unimplementedEvent', cmd, msg as Record<string, unknown>);
      return;
    }

    const parsed = parser(cmd, msg, this.roomId!, this.uid ?? 0);

    if (parsed) {
      this.emitter.emit('event', parsed);
    }
  }
}

export function createListener(config: ListenerConfig) {
  return new BliveListener(config);
}

export { BliveListener };
