import type { EntryEffect } from './entry-effect';
import type { Gift } from './gift';
import type { Guard } from './guard';
import type { LikeClick } from './like-click';
import type { LikesUpdate } from './likes-update';
import type { LiveCutoff } from './live-cutoff';
import type { LiveEnd } from './live-end';
import type { LiveStart } from './live-start';
import type { LiveWarning } from './live-warning';
import type { Message } from './message';
import type { SuperChat } from './super-chat';
import type { SuperChatDelete } from './super-chat-delete';

export * from './common';
export * from './gift';
export * from './guard';
export * from './message';
export * from './client-request';
export * from './live-start';
export * from './live-end';
export * from './live-cutoff';
export * from './live-warning';
export * from './likes-update';
export * from './like-click';
export * from './entry-effect';

export type {
  Message,
  Gift,
  Guard,
  SuperChat,
  SuperChatDelete,
  LiveStart,
  LiveEnd,
  LiveCutoff,
  LiveWarning,
  LikesUpdate,
  LikeClick,
  EntryEffect,
};

export type ViyuniEvent =
  | Message
  | Guard
  | Gift
  | SuperChat
  | SuperChatDelete
  | LiveStart
  | LiveEnd
  | LiveCutoff
  | LiveWarning
  | LikesUpdate
  | LikeClick
  | EntryEffect;
