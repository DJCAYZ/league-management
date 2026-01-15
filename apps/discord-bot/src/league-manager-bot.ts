import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import type { Command } from "./types/command.js";
import path from "path";
import fs from "fs/promises";
import type EventHandler from './events/event-handler.ts';

export class LeagueManagerBot extends Client {
  public commands: Collection<string, Command>;

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds],
    });

    this.commands = new Collection();

    this.loadCommands();
    this.loadEventHandlers();
  }

  private async loadCommands() {
    const commandsDir = path.join(import.meta.dirname, 'commands');
    const commandFolders = await fs.readdir(commandsDir);

    for (const folder of commandFolders) {
      const folderPath = path.join(commandsDir, folder);
      const commandFiles = (await fs.readdir(folderPath)).filter(filename => filename.endsWith('.command.ts'));

      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = await import(filePath) as Command;

        if ('data' in command && 'execute' in command) {
          this.commands.set(command.data.name, command);
        } else {
          console.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" export.`);
        }

      }
    }
  }

  private async loadEventHandlers() {
    const eventsDir = path.join(import.meta.dirname, 'events');
    const eventFiles = (await fs.readdir(eventsDir)).filter((filename) => filename.endsWith('.event.ts'));

    for (const eventFile of eventFiles) {
      const filePath = path.join(eventsDir, eventFile);
      const eventModule = await import(filePath) as { default: new () => EventHandler };
      const EventClass = eventModule.default;

      const event = new EventClass();
      event.attach(this);
    }
  }
}


