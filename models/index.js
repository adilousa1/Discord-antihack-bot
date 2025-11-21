require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const connectDB = require("./database.js");
const antiHack = require("./antiHack");
const antiSpam = require("./antiSpam");
const phishingFilter = require("./phishingFilter");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.config = {
  prefix: "!",
  accountAgeLimitDays: 3
};

// Database
connectDB();

// Anti-Raid / BanShare
client.on("guildMemberAdd", member => {
  antiHack(client, member);
});

// Anti-Spam & Phishing
client.on("messageCreate", message => {
  antiSpam(message);
  phishingFilter(message);
});

client.once("ready", () => {
  console.log(`Bot is Online as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
