const { Message } = require('discord.js');
const { newEmb, colors } = require('../utilities');

module.exports = {
  name: 'Serverlist',
  syntax: 'serverlist',
  args: false,
  description: 'Eine Liste aller Server auf denen ich bin mit deren ID, damit du sie finden kannst UwU',
  perm: 'DEVELOPER',
  commands: ['serverlist', 'slist'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg) {
    // const { prefix, token, owner } = msg.client.config;

    let emb = newEmb(msg).setTitle('Serverlist');

    let names = msg.client.guilds.cache.map(g => g.name);
    let ids = msg.client.guilds.cache.map(g => g.id);
    let created = msg.client.guilds.cache.map(g => g.createdAt.toLocaleDateString("de-DE"));
    let joinedAt = msg.client.guilds.cache.map(g => g.joinedAt.toLocaleDateString("de-DE"));

    for (let i = 0; i < names.length; i++) {
      emb.addField(`**${names[i]}**`, ` \`${ids[i]}\`\n\`${created[i]}\` ◈ \`${joinedAt[i]}\`\n|| ||`)
    }

    emb.setColor(colors.nothing)
    msg.channel.send(emb);
  }
};
