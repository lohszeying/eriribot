const Discord = require('discord.js');
const moment = require('moment');

commands = new Object();

commands.ping = function(msg) {
    msg.reply('pong!');
}

commands.randomNum = function(msg) {
    const ran = Math.floor(Math.random() * 10000000);
    msg.channel.send(ran);
}

commands.react = function(msg) {
    msg.react('😊');
}

commands.whatIsMyUsername = function(msg) {
    msg.reply('Your username is: ' + msg.author.username);
}

commands.echo = function(msg) {
    const newMsg = msg.content.replace("!", "").replace("echo", "").trim();
    if (!newMsg) {
        msg.channel.sendMessage("Nothing to echo");
    } else {
        msg.channel.sendMessage(newMsg);
    }
}

commands.howManyDays = function(msg, prefix, keyword) {
    const dateReceived = msg.content.replace(prefix + keyword, "").trim();

    const currDate = moment().startOf('day');
    const insertDate = moment(dateReceived);
    const diffence = moment.duration(insertDate.diff(currDate));
    msg.channel.sendMessage("**" + diffence.asDays() + "** days from now (" + currDate.format('DD/MM/YYYY') + ") to " + insertDate.format('DD/MM/YYYY'));
}

commands.help = function(msg, prefix) {
    const embed = new Discord.RichEmbed()
            .setTitle("Eriri Botto Command List")
            .addField(prefix + "ping", "Reply pong")
            .addField(prefix + "randomnum", "Randomly generate number")
            .addField(prefix + "embed", "Bot will reply with embeded")
            .addField(prefix + "react", "React to your message")
            .addField(prefix + "echo", "Echos whatever you typed")
            .addField(prefix + "whatismyusername", "Reply with your username")
            .addField(prefix + "howmanydays", "Calculate how many days from current date to target date with `!howmanydays 2021-12-25`")
            .addField(prefix + "taskl", "List your saved task")
            .addField(prefix + "taskadd <task>", "Add your task to task list. For example, `!taskadd Homework due tomorrow`")
            .addField(prefix + "taskedit", "Edit your added task")
            .addField(prefix + "taskdel", "Delete your saved task")
            .addField(prefix + "taskclear", "Delete all your saved tasks")
            .setColor(0xF1C40F)
    msg.channel.send(embed);
}

commands.embed = function(msg) {
    const embed = new Discord.RichEmbed()
            .setTitle("Testing title! :)")
            .addField('Name', msg.author.username)
            .attachFiles(['src/main/javascript/DaUser.png'])
            .setImage('attachment://src/main/javascript/DaUser.png')
            .setFooter('Testing of footer! :)')
            .setColor(0xF1C40F)
            msg.channel.sendEmbed(embed);
}

module.exports = {commands};