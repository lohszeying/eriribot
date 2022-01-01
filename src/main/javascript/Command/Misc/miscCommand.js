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

commands.help = function(message, prefix) {
    let pages = [[{command: prefix + "ping", description: "Reply pong"},
                {command: prefix + "randomnum", description: "Randomly generate number"},
                {command: prefix + "embed", description: "Bot will reply with embeded"},
                {command: prefix + "react", description: "React to your message"},
                {command: prefix + "echo", description: "Echos whatever you typed"},
                {command: prefix + "whatismyusername", description: "Reply with your username"},
                {command: prefix + "howmanydays", description: "Calculate how many days from current date to target date with `!howmanydays 2021-12-25`"},
                {command: prefix + "taskl", description: "List your saved task"},
                {command: prefix + "taskadd <task>", description: "Add your task to task list. For example, `!taskadd Homework due tomorrow`"},
                {command: prefix + "taskedit", description: "Edit your added task"}],

                [{command: prefix + "taskdel", description: "Delete your saved task"},
                {command: prefix + "taskclear", description: "Delete all your saved tasks"},
                {command: prefix + "taskcomplete", description: "Mark a task as completed"},
                {command: prefix + "taskincomplete", description: "Mark a task as incomplete"},
                {command: prefix + "helpgems", description: "Get a list of commands for primogems calculator"}
            ]];
            
    let page = 1;
    const embed = new Discord.RichEmbed()
        .setTitle("Eriri Botto Command List")
        .setColor(0xF1C40F) //sets color here
        .setFooter(`Page ${page} of ${pages.length}`)
    
    for (var j = 0; j < pages[page-1].length; j++) {
        embed.addField(pages[page-1][j].command, pages[page-1][j].description);
    }
    
    message.channel.send(embed).then(msg => {
        msg.react('⏪').then(r => {
            msg.react('⏩');
            //filters
            const isBackwards = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
            const isForwards = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;

            const backwards = msg.createReactionCollector(isBackwards);
            const forwards = msg.createReactionCollector(isForwards);

            backwards.on("collect", r => {
                if (page === 1) {
                    r.remove(message.author.id);
                    return;
                }
                page--;
                embed.fields = [];

                for (var j = 0; j < pages[page-1].length; j++) {
                    embed.addField(pages[page-1][j].command, pages[page-1][j].description);
                }

                embed.setFooter(`Page ${page} of ${pages.length}`);
                msg.edit(embed);

                r.remove(message.author.id);
            });

            forwards.on("collect", async (r, user) => {
                if (page === pages.length) {
                    r.remove(message.author.id);
                    return;
                }
                page++;

                embed.fields = [];

                for (var j = 0; j < pages[page-1].length; j++) {
                    embed.addField(pages[page-1][j].command, pages[page-1][j].description);
                }

                embed.setFooter(`Page ${page} of ${pages.length}`);
                msg.edit(embed);

                r.remove(message.author.id);
            });
        });
    });
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