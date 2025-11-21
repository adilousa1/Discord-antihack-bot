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

connectDB().catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

client.on("guildMemberAdd", member => {
  antiHack(client, member);
});

client.on("messageCreate", message => {
  antiSpam(message);
  phishingFilter(message);

  if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;
  const args = message.content.slice(client.config.prefix.length).trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();

  if (cmd === "gban") {
    if (!message.member.permissions.has("BanMembers"))
      return message.reply("❌ لا تملك صلاحية الحظر.");

    const userId = args[0];
    const reason = args.slice(1).join(" ") || "No reason provided";
    const BanList = require("./models/banList");

    if (!userId) return message.reply("اكتب آيدي المستخدم.");

    BanList.findOne({ userId }).then(found => {
      if (found) return message.reply("المستخدم موجود بالفعل في Ban-Share.");

      const rec = new BanList({ userId, reason, bannedBy: message.author.id });
      rec.save().then(() => message.reply("✔️ تم إضافة المستخدم إلى Ban-Share"));
    }).catch(err => {
      console.error(err);
      message.reply("حدث خطأ أثناء حفظ البيانات.");
    });
  }
});

client.once("ready", () => {
  console.log(`Bot is Online as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
