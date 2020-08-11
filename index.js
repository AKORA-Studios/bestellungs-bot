const fs = require("fs");
const Discord = require("discord.js");
const { Message, Collection, Client, MessageEmbed } = require("discord.js");

const { colors, confirmAction, newEmb, rawEmb } = require("./commands/utilities");

const config = require("./config.json");
var { prefix, token, owner } = config;

const client = new Client();
client.config = config;

const cooldowns = new Collection();

var error_channel;
error_channel = 714557180757409942;


//Error Handling
//==================================================================================================================================================
client.on("shardError", error => {
    console.error("A websocket connection encountered an error:", error);
});

process.on("unhandledRejection", error => {
    console.error("Unhandled promise rejection:", error);
});

process.on("warning", console.warn);
//==================================================================================================================================================



//==================================================================================================================================================

//Initialize the Commands
client.commands = new Discord.Collection();

const commandDirectorys = fs
    .readdirSync("./commands").map(name => "./commands/" + name).filter(path => fs.lstatSync(path).isDirectory());

for (const dir of commandDirectorys) {
    const module_name = dir.split('/')[dir.split('/').length - 1];
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

    for (let file of commandFiles) {
        const command = require(`${dir}/${file}`);
        client.commands.set(command.name, {
            command: command,
            module: module_name
        });
    }
}

//Ready
//==================================================================================================================================================
console.log("Logging in...");
client.on("ready", async () => {
    console.log("Logged in as: " + client.user.tag);

    client.user.setStatus("idle");

    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        client.user.setActivity(activities_list[index]);
    }, 30000);


    const activities_list = [
        `${client.guilds.cache.size} Server UwU`,
        `${config.prefix}help`,
        //()` Version: ${config.version}`
    ];

    //Channel Um Fehler zu loggen
    error_channel = client.guilds.cache
        .find(g => g.id == 553942677117337600)
        .channels.cache.find(c => c.id == error_channel && c.type == "text");
});
//==================================================================================================================================================




//Message
//==================================================================================================================================================
client.on("message", async message => {
    ///////////////////////////////////////////////////
    if (message.content === "!join") {
        client.emit("guildMemberAdd", message.member);
    }
    /////////////////

    prefix = config.prefix;
    if (message.mentions.members.first() && message.mentions.members.first().id == client.user.id && !message.content.startsWith(prefix)) message.channel.send("Mein Prefix ist " + config.prefix)

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    var emb = newEmb(message)
        .setColor(colors.nothing)



    const args = message.content.slice(prefix.length).split(/ +/);
    ////leeeeeel neues prefix yk

    const commandName = args.shift().toLowerCase();

    const commandObj = client.commands.find(cmd => cmd.command.commands.includes(commandName));
    if (!commandObj) return;

    const { command, module } = commandObj;

    if (command.commands.includes("reload") && owner.includes(message.author.id)) {
        return reloadModules(args[0].toLowerCase(), message);
    }

    


    var emb = rawEmb(message);
    if (command.perm) {
        if (command.perm == 'DEVELOPER') {
            if (!config.owner.includes(message.author.id)) {
                emb.setDescription("**Du bist leider kein `Developer` qwq** ").setColor(colors.nothing);
                return message.channel.send(emb);
            }
        } else {
            if (!(message.member.hasPermission(command.perm) )) {
                emb.setDescription("**Dir fehltfolgende Berechtigung:,** `"+ command.perm).setColor(colors.nothing);
                return message.channel.send(emb);
            }
        }
    }



    if (command.args && !args.length) {
        emb.setDescription(`Du musst Argumente angeben, <@${message.member.id}>!`);

        if (command.syntax) {
            emb.addField(`Syntax`, `\`${prefix}${command.syntax}\``)
        }
        return message.channel.send(emb);
    }






    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }


    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            emb
                .setDescription(`Nicht so schnell mit den Jungen Pferden :D`)
                .addField("Cooldown", timeLeft.toFixed(1));
            return message.channel.send(emb);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);




    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        emb.setDescription(
            `Es gibt wohl noch etwas Technische Probleme mit diesem Befehl :0`
        );
        message.channel.send(emb);

        emb = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setFooter(client.user.tag, client.user.displayAvatarURL())
            .setTimestamp(new Date());

        emb
            .setTitle("Fehler")
            .addField("Auf:", `\`${message.guild.name}\``, true)
            .addField("In:", `\`${message.channel.name}\``, true)
            .addField("Von:", `<@${message.author.id}>`, true)
            .addField("Befehl:", `\`${message.content}\``, false)
            .addField("Fehler:", `\`${error}\``, false);

        error_channel.send(emb);
    }
});
//==================================================================================================================================================

client.login(token);

/**
 * @param {string} argument
 * @param {Message} msg
 */
const reloadModules = async function (argument, msg) {
    const commandDirectorys = fs
        .readdirSync("./commands").map(name => "./commands/" + name).filter(path => fs.lstatSync(path).isDirectory());

    let text = "**LOAD MODULES**";
    msg = await msg.channel.send(text);
    var module_count = 0;

    if (argument.includes('/')) {
        let dir = './commands/' + argument.split('/')[0];
        let module_name = argument.split('/')[0];
        let file = argument.split('/')[1];

        if (!commandDirectorys.includes(dir)) return msg.channel.send('Modul nicht gefunden ;-;');

        let files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
        if (!files.map(name => name.split('.')[0]).includes(file)) return msg.channel.send('Befehl nicht gefunden ;-;');

        let path = `${dir}/${file}`;

        try {
            delete require.cache[require.resolve(path)];
            const newCommand = require(path);

            client.commands.set(newCommand.name, {
                command: newCommand,
                module: module_name
            });

            module_count++;
            text += `\n **>** \`${module_name}/${newCommand.name}\``;
            return msg.edit(text);
        } catch (error) {
            console.log(error);
            return msg.channel.send(`Beim neuladen von \`${newCommand.name}\` ist ein Fehler aufgetreten:\n\`${error.message}\``);
        }
    } else if (commandDirectorys.includes('./commands/' + argument)) {
        let dir = './commands/' + argument.split('/')[0];
        let file = argument.split('/')[1];

        if (!commandDirectorys.includes(dir)) return msg.channel.send('Modul nicht gefunden ;-;');

        commandDirectorys = new Array();
        commandDirectorys[0] = dir;
    }

    for (const dir of commandDirectorys) {
        const module_name = dir.split('/').reverse()[0];
        const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

        for (let file of commandFiles) {
            let path = `${dir}/${file}`;

            try {
                delete require.cache[require.resolve(path)];
                const newCommand = require(path);

                client.commands.set(newCommand.name, {
                    command: newCommand,
                    module: module_name
                });

                module_count++;
                text += `\n **>** \`${module_name}/${newCommand.name}\``;
                //msg.edit(text);
            } catch (error) {
                console.log(error);
                msg.channel.send(`Beim neuladen von \`${newCommand.name}\` ist ein Fehler aufgetreten:\n\`${error.message}\``);
            }
        }
    }
    
    msg.edit("Es wurden `"+module_count+"` Module neu geladen uwu");
}