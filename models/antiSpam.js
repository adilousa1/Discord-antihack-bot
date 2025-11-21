const userMessages = {};

module.exports = (message) => {
  if (message.author.bot) return;

  const id = message.author.id;
  const now = Date.now();

  if (!userMessages[id]) userMessages[id] = [];
  userMessages[id].push(now);

  userMessages[id] = userMessages[id].filter(t => now - t < 4000);

  if (userMessages[id].length >= 5) {
    if (message.member.moderatable) {
      message.member.timeout(15000, "Spam detected").catch(()=>{});
      message.channel.send(`⚠️ ${message.author} تم اعتباره سبام`);
    }
    userMessages[id] = [];
  }
};
