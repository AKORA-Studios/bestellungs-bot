
const { Message } = require('discord.js');
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
    execute(msg) {
    let emb = newEmb(msg)
        
    let user = msg.client.user;
    var member = msg.guild.member(user);

    if (member.permissions.has('ADMINISTRATOR')) {a = emotes.true} else {a = emotes.false}
    if (member.permissions.has('CREATE_INSTANT_INVITE')) {b = emotes.true} else {b = emotes.false}
    if (member.permissions.has('KICK_MEMBERS')) {c = emotes.true} else {c = emotes.false}
    if (member.permissions.has('BAN_MEMBERS')) {d = emotes.true} else {d = emotes.false}
    if (member.permissions.has('ADD_REACTION')) {e = emotes.true} else {e = emotes.false}

    if (member.permissions.has('MANAGE_CHANNELS')) {f = emotes.true} else {f = emotes.false}
    if (member.permissions.has('MANAGE_MESSAGES')) {g = emotes.true} else {g = emotes.false}
    if (member.permissions.has('MENTION_EVERYONE')) {h = emotes.true} else {h = emotes.false}

    if (member.permissions.has('CONNECT')) {i = emotes.true} else {i = emotes.false}
    if (member.permissions.has('SPEAK')) {j = emotes.true} else {j = emotes.false}
    if (member.permissions.has('MUTE_MEMBERS')) {k = emotes.true} else {k = emotes.false}

    if (member.permissions.has('DEAFEN_MEMBERS')) {l = emotes.true} else {l = emotes.false}
    if (member.permissions.has('MOVE_MEMBERS')) {m = emotes.true} else {m = emotes.false}
    if (member.permissions.has('MANAGE_NICKNAMES')) {n = emotes.true} else {n = emotes.false}
    if (member.permissions.has('MANAGE_ROLES_OR_PERMISSIONS')) {o = emotes.true} else {o = emotes.false}




      emb.setTitle("Berechtigungen")
    
      .addField("**ADMINISTRATOR**", a)
      .addField("**CREATE_INSTANT_INVITE**", b)
      .addField("**KICK_MEMBERS**", c)
      .addField("**BAN_MEMBERS**", d)
      .addField("**ADD_REACTIONS**", e)
      
      .addField("**MANAGE_CHANNELS**", f)
      .addField("**MANAGE_MESSAGES**", g)
      .addField("**MENTION_EVERYONE**", h)

      .addField("**CONNECT**", i)
      .addField("**SPEAK**", j)
      .addField("**MUTE_MEMBERS**", k)

      .addField("**DEAFEN_MEMBERS**", l)
      .addField("** MOVE_MEMBERS**", m)
      .addField("**MANAGE_NICKNAMES**", n)
      .addField("**MANAGE_ROLES_OR_PERMISSIONS**", o) 

    msg.channel.send(emb) 
      
        
    }
};