import { EventEmitter } from 'events';

import { Cmd } from '@viyuni/event-types';
import { fetchDanmuInfo, fetchNavInfo } from '@viyuni/shared';
import { KeepLiveTCP } from 'bilibili-live-ws';
import { parseCookie } from 'cookie';

import * as AllParsers from './parsers';
import { ParserEventStatus, type ListenerConfig, type ListenerEvents } from './types';

class BliveListener {
  private ws: KeepLiveTCP | null = null;
  private roomId: number;
  private emitter = new EventEmitter<ListenerEvents>();
  private cookie = '';
  private buvid = '';
  private uid = 0;
  private static parsers = Object.values(AllParsers);

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
    this.ws.addListener('close', () => this.emitter.emit('close'));
    this.ws.addListener('error', (err) => this.emitter.emit('error', err));
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
  on(event: 'event', callback: (...args: ListenerEvents['event']) => void): () => void;
  on(event: 'close', callback: (...args: ListenerEvents['close']) => void): () => void;
  on(event: 'error', callback: (...args: ListenerEvents['error']) => void): () => void;
  on(
    event: typeof ParserEventStatus.Unknown,
    callback: (...args: ListenerEvents['unknown']) => void,
  ): () => void;
  on(
    event: typeof ParserEventStatus.Unimplemented,
    callback: (...args: ListenerEvents['unimplemented']) => void,
  ): () => void;
  on(
    event: typeof ParserEventStatus.ParsingFailed,
    callback: (...args: ListenerEvents['parsingFailed']) => void,
  ): () => void;
  on(event: keyof ListenerEvents, callback: (...args: any[]) => any) {
    this.emitter.on(event, callback);
    return () => this.emitter.off(event, callback);
  }

  private handleMsg(msg: any) {
    const cmd = msg?.cmd as Cmd | undefined;

    if (!cmd) return;

    const isKnownCmd = Object.values(Cmd).includes(cmd);

    if (!isKnownCmd) {
      this.emitter.emit(ParserEventStatus.Unknown, msg);
      return;
    }

    const parser = BliveListener.parsers.find((parser) => parser.cmd === cmd)?.parser;

    if (!parser) {
      this.emitter.emit(ParserEventStatus.Unimplemented, cmd, msg);
      return;
    }

    try {
      const parsed = parser(cmd, msg, this.roomId!, this.uid ?? 0);

      if (parsed) {
        this.emitter.emit('event', parsed);
      }
    } catch (error) {
      console.error(`[Room ${this.roomId}] [ParseError] [${cmd}]:`, error);
      this.emitter.emit(ParserEventStatus.ParsingFailed, cmd, msg, error);
    }
  }
}

export function createListener(config: ListenerConfig) {
  return new BliveListener(config);
}

export { BliveListener };
