const {Message} = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');


module.exports = {
    name: 'Up',
    syntax: 'up',
    args: false,
    description: 'Bin ich online.....?',
    perm: 'DEVELOPER',
    commands: ['up'],
    
    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {


        let emb = newEmb(msg)
		emb.setColor(colors.nothing)
 	emb.setTitle("Ich bin bereit Bestellungen aufzunehmen OvO")
	emb.footer = undefined;
        emb.timestamp = undefined;

       
        msg.channel.send(emb);

    }
};
