const { Message } = require('discord.js');
const { colors, newEmb, getAnswer, getInvite } = require('../utilities');
const config = require("../config.json");

module.exports = {
  name: 'Order',
  syntax: 'order <Bestellung>',
  args: true,
  description: 'Damit kannst du Designs bestellen OvO',
  commands: ['order'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  async execute(msg, args) {
    var order_channel;
 
    order_channel = config.order_channel //= 715529375260606564;

    let order = args.join(" ");

    var questions = [
      "Artikel",
      "Farben",
      "Schrift",
      "Text",
      "Symbole",
      "Sonstiges",
      "Thema"
    ];

    questions = [];

    var answers = [];

    for (let quest of questions) {
      answers.push(await getAnswer(msg, quest+"?", 30));
    }



    let emb = newEmb(msg).setTitle("Bestellung").setDescription("```"+order+"```").setColor(colors.success);
    emb.addField('\u200b', '\u200b'); //Blank Field
  
    for (let i = 0; i < answers.length; i++) {
      const quest = questions[i];
      const awnswer = answers[i];

      emb.addField("**"+quest+"**", awnswer+"\n\u200b", false);
      //emb.addField('\u200b', '\u200b'); //Blank Field
    }

    let inv = await getInvite(msg.guild);
    emb.addField('\u200b', 
      `[${inv !== null ? msg.guild.name : "Message Link"}](${inv !== null ? inv.url : msg.url})  **|**  [Slix Design](https://discord.gg/TaAZVZx)`
    )

    emb.setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    msg.channel.send(emb);//Send in Channel

    emb.setFooter(msg.guild.name, msg.guild.iconURL());

    //Send in order Channel
    order_channel = await msg.client.channels.fetch(order_channel);

    if (!order_channel || order_channel.type !== "text") return msg.channel.send("Der Channel ist wohl verloren gegangen qwq Ein Developer wird sich schnells möglich dem Problem annehmen")
    try { order_channel.send(emb) } catch (e) { return msg.channel.send(emb.setDescription(e).setTitle("Fehler qwq").setColor(colors.nothing)) }
  }
};