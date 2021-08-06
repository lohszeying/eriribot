const Discord = require('discord.js');

function UserCommand(msg, arg) {
    switch (arg) {
        case 'ping':
            //msg.channel.sendMessage('pong!');
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
            //msg.channel.sendCode("", commands.helperi());
            break;
        case 'react':
            msg.react('😊');
        default:
            break;
    }
}

commands = new Object();
commands.helperi = function(msg) {
    //To only return text, refer to this tutorial: http://www.javascriptkit.com/javatutors/oopjs.shtml
    const txt = "I only have this command:\n\n" +
                "!hello -> reply HELLO\n" +
                "!randomnum -> randomly generate number :O\n" +
                "!ping -> reply pong\n" +
                "!embed -> some stuff i'm testing";
    msg.channel.sendCode("", txt);
}

commands.embed = function(msg) {
    const embed = new Discord.RichEmbed()
            .setTitle("Testing title! :)")
            .addField('Name', msg.author.username)
            //.setThumbnail(msg.author.avatarURL)
            .attachFiles(['DaUser.png'])
            .setImage('attachment://DaUser.png')
            .setFooter('Testing of footer! :)')
            .setColor(0xF1C40F)
            msg.channel.sendEmbed(embed);
}

module.exports = { UserCommand };