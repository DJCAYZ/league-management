import "dotenv/config";
import { LeagueManagerBot } from "./league-manager-bot.ts";

const bot = new LeagueManagerBot();

bot.login(process.env.DISCORD_BOT_TOKEN);