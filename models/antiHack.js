const BanList = require("./models/banList");

module.exports = async (client, member) => {
  const config = client.config;

  const isBanned = await BanList.findOne({ userId: member.id });
  if (isBanned) {
    try {
      await member.kick("User is globally banned (Ban-Share)");
      console.log(`[BanShare] Kicked: ${member.id}`);
    } catch (err) {
      console.error("Failed to kick:", err);
    }
    return;
  }

  const accountAge = Date.now() - member.user.createdTimestamp;
  const minAge = 1000 * 60 * 60 * 24 * config.accountAgeLimitDays;

  if (accountAge < minAge) {
    try {
      await member.kick("Account too new – Anti-Raid");
      console.log(`[AntiRaid] Kicked: ${member.id}`);
    } catch (err) {
      console.error("Failed to kick new account:", err);
    }
    return;
  }

  if (!member.user.avatar) {
    console.log(`[Warning] User has no avatar: ${member.id}`);
  }
};
