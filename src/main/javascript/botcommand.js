const Discord = require('discord.js');

function UserCommand(msg, arg) {
    switch (arg[0]) {
        case 'ping':
            msg.reply('pong!')
            break;
        case 'randomnum':
            var ran = Math.floor(Math.random() * 10000000);
            msg.channel.sendMessage(ran);
            break;
        case 'embed':
            commands.embed(msg);
            break;
        case 'hello':
            msg.channel.sendMessage("HELLO!!!");
            break;
        case 'helperi':
            commands.helperi(msg);
            break;
        case 'react':
            msg.react('😊');
            break;
        case 'whatismyusername':
            msg.reply('Your username is: ' + msg.author.username);
            break;
        case 'echo':
            const newMsg = msg.content.replace("!", "").replace("echo", "").trim();
            if (!newMsg) {
                msg.channel.sendMessage("Nothing to echo");
            } else {
                msg.channel.sendMessage(newMsg);
            }
            
            break;
        default:
            break;
    }
}

commands = new Object();
commands.helperi = function(msg) {
    const txt = "I only have this command:\n\n" +
        "!hello -> reply HELLO\n" +
        "!randomnum -> randomly generate number :O\n" +
        "!ping -> reply pong\n" +
        "!embed -> some stuff i'm testing\n" +
        "!react -> I will react to your message\n" +
        "!echo -> I will echo your message\n" +
        "!whatismyusername -> I will reply you your username";
    msg.channel.sendCode("", txt);
}

commands.embed = function(msg) {
    const embed = new Discord.RichEmbed()
            .setTitle("Testing title! :)")
            .addField('Name', msg.author.username)
            //Previous file path was .attachFiles(['DaUser.png'])
            .attachFiles(['src/main/javascript/DaUser.png'])
            .setImage('attachment://src/main/javascript/DaUser.png')
            .setFooter('Testing of footer! :)')
            .setColor(0xF1C40F)
            msg.channel.sendEmbed(embed);
}

module.exports = { UserCommand };