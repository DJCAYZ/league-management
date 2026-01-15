import { Events, type ClientEvents } from 'discord.js';
import EventHandler from './event-handler.ts';
import type { LeagueManagerBot } from '../league-manager-bot.ts';

export default class ReadyHandler extends EventHandler {
  constructor() {
    super({
      event: Events.ClientReady,
    });
  }

  async execute(...[client]: ClientEvents[Events.ClientReady]) {
    const bot = client as LeagueManagerBot;
    console.log(`Ready! Logged in as ${bot.user?.username} (${bot.user?.tag})`);
  }
}