const Discord = require('discord.js');
const bot = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

const PREFIX = '!';

bot.login(token);

bot.on('ready', () => {
    console.log('Online!');
})

bot.on('message', msg => {
    let args = msg.content.substring(PREFIX.length).split(" ");
    switch (args[0]) {
        case 'ping':
            //msg.channel.sendMessage('pong!');
            msg.reply('pong!')
            break;
        case 'randomnum':
            var ran = Math.floor(Math.random() * 10000000);
            msg.channel.sendMessage(ran);
            break;
        case 'codetest':
            msg.channel.sendCode("Java", "Hello");
        case 'embed':
            const embed = new Discord.RichEmbed()
            .setTitle("User info")
            .addField('Name', msg.author.username)
            //.setThumbnail(msg.author.avatarURL)
            .attachFiles(['DaUser.png'])
            .setImage('attachment://DaUser.png')
            .setFooter('Testing of footer! :)')
            .setColor(0xF1C40F)
            msg.channel.sendEmbed(embed);
        case 'hello':
            msg.channel.sendMessage("HELLO!!!");
        case 'helperi':
            msg.channel.sendCode("",
                "I only have this command:\n" +
                "  !hello -> reply HELLO\n" +
                "  !codetest -> idk what am i doing\n" +
                "  !randomnum -> randomly generate number :O\n" +
                "  !ping -> reply pong\n" +
                "  !embed -> some stuff i'm testing");
        default:
            break;
    }
})