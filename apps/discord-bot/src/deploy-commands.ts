import { ApplicationCommand, REST, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import type { Command } from './types/command.ts';

import "dotenv/config";

(async () => {
  if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error('DISCORD_BOT_TOKEN is not configured.');
  }

  if (!process.env.DISCORD_APPLICATION_ID) {
    throw new Error('DISCORD_APPLICATION_ID is not configured.');
  }

  if (!process.env.DISCORD_DEV_SERVER_ID) {
    throw new Error('DISCORD_DEV_SERVER_ID is not configured.');
  }

  const commands: SlashCommandBuilder[] = [];

  const foldersPath = path.join(process.cwd(), 'src', 'commands');
  const commandFolders = await fs.readdir(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = (await fs.readdir(commandsPath)).filter(filename => filename.endsWith('.command.ts'));

    for (const commandFile of commandFiles) {
      const filePath = path.join(commandsPath, commandFile);
      const command = await import(filePath) as Command;

      if ('data' in command && 'execute' in command) {
        commands.push(command.data);
      } else {
        console.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" export.`);
      }
    }
  }

  const restClient = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

  try { 
    console.log(`Started refreshing ${commands.length} application commands.`);

    if (process.env.NODE_ENV === 'production') {
      const data = await restClient.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), { body: commands }) as ApplicationCommand[];
      console.log(`Successfully reloaded ${data.length} global application commands.`);
    } else {
      const data = await restClient.put(Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_DEV_SERVER_ID), { body: commands }) as ApplicationCommand[];
      console.log(`Successfully reloaded ${data.length} application commands to development server.`);
    }
  } catch(error) {
    console.error(error);
  }
})()