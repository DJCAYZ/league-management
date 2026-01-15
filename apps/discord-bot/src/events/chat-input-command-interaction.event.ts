import { AuditLogEvent, AutoModerationActionExecution, AutoModerationRule, Client, DMChannel, Entitlement, Events, ForumChannel, Guild, GuildAuditLogsEntry, GuildBan, GuildEmoji, GuildMember, GuildScheduledEvent, GuildScheduledEventStatus, Invite, MediaChannel, Message, MessageFlags, MessageReaction, NewsChannel, PollAnswer, Presence, Role, StageInstance, Sticker, Subscription, TextChannel, ThreadMember, Typing, User, VoiceChannel, VoiceChannelEffect, VoiceState, type AnyThreadChannel, type ApplicationCommandPermissionsUpdateData, type CacheType, type ClientEvents, type CloseEvent, type GuildMembersChunk, type GuildSoundboardSound, type GuildTextBasedChannel, type Interaction, type MessageReactionEventDetails, type NonThreadGuildBasedChannel, type OmitPartialGroupDMChannel, type PartialGuildMember, type PartialGuildScheduledEvent, type PartialMessage, type PartialMessageReaction, type PartialPollAnswer, type PartialSoundboardSound, type PartialThreadMember, type PartialUser, type ReadonlyCollection, type TextBasedChannel } from 'discord.js';
import EventHandler from './event-handler.ts';
import type { LeagueManagerBot } from 'league-manager-bot.ts';

export default class ChatInputCommandInteractionEvent extends EventHandler {
  constructor() {
    super({
      event: Events.InteractionCreate,
    });
  }

  async execute(...[interaction]: ClientEvents[Events.InteractionCreate]) {
    const bot = interaction.client as LeagueManagerBot;
    
    if (!interaction.isChatInputCommand()) return;
      const command = bot.commands.get(interaction.commandName);

      try {
        await command?.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'There was an error while executing this command.',
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: 'There was an error while executing this command!',
            flags: MessageFlags.Ephemeral,
          });
        }
      }
  }
}