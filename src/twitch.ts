// src/twitch.ts

import tmi from 'tmi.js';
import { Counter } from './models/Counter';
import pusher from './pusher';

let tmiClient: tmi.Client;

export const connectTwitchChats = (channels: string[]) => {
  tmiClient = new tmi.Client({
    options: { debug: true },
    connection: { reconnect: true },
    channels: channels,
  });

  tmiClient.connect();

  tmiClient.on('message', async (channel, userstate, message, self) => {
    if (self) return;
    if (message.includes('specific_string')) {
      const counter = await Counter.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      if (counter) {
        pusher.trigger('counter', 'update', { count: counter.count });
      }
    }
  });
};

export const addChannel = async (channel: string) => {
  if (tmiClient) {
    await tmiClient.join(channel);
  }
};

export const removeChannel = async (channel: string) => {
  if (tmiClient) {
    await tmiClient.part(channel);
  }
};
