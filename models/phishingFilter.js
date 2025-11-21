const badLinks = ["free-nitro", "steam-gift", "discord-nitro", "airdrop", "nitrofree"];

module.exports = (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  if (badLinks.some(link => content.includes(link))) {
    message.delete().catch(()=>{});
    if (message.member.moderatable) {
      message.member.timeout(60000, "Phishing link detected").catch(()=>{});
    }
    message.channel.send(`❌ تم حذف رابط مشبوه من ${message.author}`).catch(()=>{});
  }
};
