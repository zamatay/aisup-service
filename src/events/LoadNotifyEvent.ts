import { EventEmitter } from "node:events";

class LoadNotifyEvent extends EventEmitter{}

export const notifyEvent = new LoadNotifyEvent();