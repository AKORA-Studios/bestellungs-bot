
const { Message, Permissions } = require('discord.js');
const { newEmb, emotes } = require('../utilities');

module.exports = {
  name: 'Permissions',
  syntax: 'permissions',
  args: false,
  description: 'Zeigt dir alle Berechtigungen die ich auf diesem Server besitze',
  commands: ['permissions', 'perm'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {
    let emb = newEmb(msg).setTitle("Berechtigungen");

    var me = msg.guild.me,
      all = msg.guild.owner.permissions.toArray(),
      text = "",
      tile_size = isNaN(Number(args[0])) ? 5 : Number(args[0]),
      tile_count = all.length % tile_size;

    if (tile_count === 0) {
      tile_count = all.length / tile_size
    } else {
      tile_count = Math.floor(all.length / tile_size) + 1;
    }

    for (let x = 0; x < tile_count; x++) {
      for (let y = 0; y < tile_size; y++) {
        let pos = (x * tile_size) + y;
        if (pos > all.length-1) continue;
        let perm = all[pos];

        if (me.permissions.has(perm)) {
          text += emotes.true +  "`" + perm.toString() + "`";
        } else {
          text += emotes.false + "`" + perm.toString() + "`";
        }

        text += "\n"; //New Line
      }
      emb.addField('\u200b', text, true);
      text = "";//Reset
    }

    emb.setDescription(text);

    msg.channel.send(emb);
  }
};