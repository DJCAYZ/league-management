import { bold, ChatInputCommandInteraction, inlineCode, MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName('server')
  .setDescription('Provides information about the server.');

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.inGuild || !interaction.guild) {
    await interaction.reply({ content: 'This command must be used in a server.', flags: MessageFlags.Ephemeral });
    return;
  }

  await interaction.reply(`This server is ${inlineCode(interaction.guild.name)} and has ${bold(String(interaction.guild.memberCount))} members.`);
}
