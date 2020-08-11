const { Message, MessageEmbed, Guild } = require("discord.js");

const colors = {
    error: 0xF91A3C,
    red: 0xf2d346,
    info: 0x1AE3F9,
    success: 0x13EF8D,
    warning: 0xF9D71A,
    unimportant: 0x738F8A,
    nothing: 0x2C2F33
}
const emotes = {
    false: "<:false:740942401413185656>",
    true: "<:true:740942401161527426>",
    mobile: "<:mobile:741225706843013122>",
    bot: "<:Clyde:741225707203592232>",
    desktop: "<:desktop:741225709351206993>"

}


/**
 * @callback MessageAction
 * @param {Message} m the Message from the Confirmation Embed
 * @returns {void}
*/

/**
 * A simple Framework for a Action Confirm
 * @param {Message} msg Message from the Command
 * @param {string} text Text for the Embed
 * @param {MessageAction} confim Action executed when confirmed
 * @param {MessageAction} cancel Action executed when canceld
 */

const confirmAction = (msg, text, confim, cancel) => {
    var emb = newEmb(msg);

    emb.setTitle('Bestätigung').setDescription(text)

    msg.channel.send(emb).then(async message => {
        emb = newEmb(msg);

        const filter = (reaction, user) => {
            return reaction.emoji.name === '✅' ||
                reaction.emoji.name === '❌' &&
                user.id === msg.author.id;
        };
        const collector = message.createReactionCollector(filter, { time: 5000 });

        await message.react('✅');
        await message.react('❌');

        collector.on('collect', (reaction, user) => {
            reaction.remove().catch();

            switch (reaction.emoji.name) {
                case '✅':
                    emb.setTitle('Bestätigt uwu');
                    emb.setColor(colors.success);
                    message.edit(emb).then(m => {
                        confim(m);
                    });
                    collector.removeAllListeners();
                    break;
                case '❌':
                    emb.setTitle('Abgebrochen qwq');
                    emb.setColor(colors.error);
                    message.edit(emb).then(m => {
                        cancel(m);
                    });
                    collector.removeAllListeners();
                    break;
                default:
                    reaction.remove().then().catch();
                    break;
            }
        });

        collector.on('end', collected => {
            emb.setTitle('Abgebrochen qwq');
            emb.setColor(colors.success);
            message.edit(emb).then(m => {
                cancel(m);
            });
        });
    });
}

/**
 * @param {Message} msg 
 * @returns {MessageEmbed} a clean Embed
 */
const newEmb = (msg) => {
    return new MessageEmbed()
        //.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setColor(colors.red)
        .setFooter(msg.client.user.tag, msg.client.user.displayAvatarURL())
        .setTimestamp(new Date());
}
/**
 * @param {Message} msg 
 * @returns {MessageEmbed} a clean Embed
 */
const rawEmb = (msg) => {
    return new MessageEmbed()
        //.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setColor(colors.red);
    //.setFooter(msg.client.user.tag, msg.client.user.displayAvatarURL())
    //.setTimestamp(new Date());
}

/**
 * @param {Message} msg 
 * @returns {MessageEmbed} a clean Embed
 */
const emptyEmb = (msg) => {
    return new MessageEmbed()
        .setColor(colors.nothing);

}

/**
 * @param {Message} msg  Message
 * @param {string} question Question?
 * @param {number} time Time in seconds
 */
const getAnswer = async (msg, question, time) => {
    return new Promise(async (resolve, reject) => {
        const channel = msg.channel;
        let emb = rawEmb(msg);

        await msg.channel.send(emb.setTitle(question).setColor(colors.info).setFooter("cancel, to abort | " + time + " Seconds to answer"));
        emb = rawEmb(msg);

        const collector = channel.createMessageCollector(m => m.author.id === msg.author.id, {
            max: 1,
            time: time * 1000,
            errors: ['time']
        });

        collector.on("collect",
            /** @param {Message} m  */
            m => {
                const cont = m.content;

                if (cont === "" || !cont) {
                    msg.channel.send(emb.setTitle("Empty Message").setColor(colors.error)).then(() => {
                        reject("Empty Message Send");
                    }).catch((e) => {
                        reject("Couldnt Send Message\n" + e);
                    });
                } else if (cont.toLowerCase().includes("cancel")) {
                    msg.channel.send(emb.setTitle("Canceld").setColor(colors.error)).then(() => {
                        reject("Action Canceld");
                    }).catch((e) => {
                        reject("Couldnt Send Message\n" + e);
                    });
                } else {
                    resolve(cont);
                    /* Sendet das Angegebene nochmal
          
                    msg.channel.send(emb.setTitle(question).setDescription("> " + cont)).then(() => {
                      resolve(cont);
                    }).catch((e) => {
                      reject("Couldnt Send Message\n" + e);
                    });
                    */
                }
            })

        collector.on("end", (collected) => {
            if (collected.size > 0) return; //Falls schon ne antwort kam

            msg.channel.send(emb.setTitle("Time Expired").setColor(colors.error)).then(() => {
                reject("Time expired");
            }).catch((e) => {
                reject("Couldnt Send Message\n" + e);
            });
        });
    });
}

/**
 * @param {Guild} guild 
 */
const getInvite = async (guild) => {
    let inv;
    try {
        let invites = (await guild.fetchInvites()).array();

        inv = invites.find((i) =>
            i.inviter.id === guild.me.id && i.maxUses === 0 && i.maxAge === 0
        );

        if (!inv) {
            let channel = guild.channels.cache.find(c => c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'));
            if (!channel) return null;

            inv = await channel.createInvite({
                maxAge: 0,
                maxUses: 0,
                unique: true,
                reason: "Invite for Slix Design"
            });
        }
    } catch(e) {
        return null;
    }

    return inv;
}

module.exports = { colors, confirmAction, newEmb, emptyEmb, rawEmb, emotes, getAnswer, getInvite };