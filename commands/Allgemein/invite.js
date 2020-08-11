const { Message } = require('discord.js');
const { colors, newEmb } = require('../utilities');

module.exports = {
  name: 'Invite',
  syntax: 'invite',
  args: false,
  description: 'Gibt den Link mit dem du mich zu deinem server hinzufügen kannst UwU',
  commands: ['invite', 'inv', 'link'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg) {

    let link = "https://discord.com/api/oauth2/authorize?client_id="+msg.client.user.id+"&permissions=8&scope=bot";
    let invite = "https://discord.gg/qmEynWg";
    let emb = newEmb(msg)
      .setTitle("Invite Links")
      .addField("**Bot-Invite**", `[Klick](${link})`)
      .addField("**Support Server (Akora)**", `[Klick](${invite})`)
      .setColor(colors.nothing)

   
    msg.channel.send(emb);

  }
};