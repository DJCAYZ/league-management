import { ChatInputCommandInteraction, italic, MessageFlags, SlashCommandBuilder, time, userMention } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName('user')
  .setDescription('Provides information about the user.');

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.inGuild || !interaction.guild) {
    await interaction.reply({ content: 'This command must be used in a server.', flags: MessageFlags.Ephemeral });
    return;
  }

  const member = await interaction.guild.members.fetch(interaction.user.id);
  await interaction.reply({
    content: `This command was run by ${userMention(interaction.user.id)}, who joined on ${member.joinedAt ? time(member.joinedAt) : italic('n/a')}.`,
    allowedMentions: {
      parse: [],
    }
  });

}
