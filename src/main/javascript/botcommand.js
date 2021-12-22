const Discord = require('discord.js');
const taskSchema = require('./taskSchema')
const moment = require('moment');


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
        case 'taskadd':
            commands.taskAdd(msg);
            break;
        case 'taskl':
            commands.taskList(msg);
            break;
        case 'taskdel':
            commands.taskDelete(msg);
            break;
        case 'taskedit':
            commands.taskEdit(msg);
            break;
        case 'howmanydays':
            const dateReceived = msg.content.replace("!howmanydays", "").trim();

            const currDate = moment().startOf('day');
            const insertDate = moment(dateReceived);
            const diffence = moment.duration(insertDate.diff(currDate));
            msg.channel.sendMessage("**" + diffence.asDays() + "** days from now (" + currDate.format('DD/MM/YYYY') + ") to " + insertDate.format('DD/MM/YYYY'));
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
        "!whatismyusername -> I will reply you your username\n" +
        "!howmanydays -> Calculate how many days from current date to target date with `!howmanydays 2021-12-25`\n" +
        "!taskl -> Check your task list\n" +
        "!taskadd <task> -> Add your task\n" +
        "!taskedit -> Edit your task\n" +
        "!taskdel -> Delete your task";
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

commands.taskAdd = async function(msg) {
    const newMsg = msg.content.replace("!taskadd", "").trim();

    await taskSchema.create({
        message: newMsg,
        author: msg.author.id,
    });

    const list = await taskSchema.find({
        author: msg.author.id
    })

    let desc = "";

    for (var i = 0; i < list.length; i++) {
        desc += (i+1) + ": " + list[i].message + "\n";
    }

    msg.reply("Successfully saved task: `" + newMsg + "`.\n" +
        "Here are the list of tasks you have saved: \n```" + desc + "```");
}

commands.taskList = async function(msg) {
    const list = await taskSchema.find({
        author: msg.author.id
    })

    if (list.length === 0) {
        msg.reply("You do not have any saved task.");
    } else {
        let desc = "";

        for (var i = 0; i < list.length; i++) {
            desc += (i+1) + ": " + list[i].message + "\n";
        }
    
        msg.reply("Here are the list of tasks you have saved: \n```" + desc + "```");
    }
}

commands.taskDelete = async function(msg) {
    const newMsg = msg.content.replace("!taskdel", "").trim();

    if (newMsg === '') {
        const list = await taskSchema.find({
            author: msg.author.id
        })

        if (list.length === 0) {
            msg.reply("You do not have any saved task.");
        } else {
            let desc = "";
    
            for (var i = 0; i < list.length; i++) {
                desc += (i+1) + ": " + list[i].message + "\n";
            }
    
            let filter = m => m.author.id === msg.author.id
            msg.reply("Here is your list of task. Please reply with the number to delete:\n```" + desc + "```").then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    
                    if (!isNaN(message)) {
                        const numToDel = parseInt(message.content)-1;

                        if (parseInt(message.content) > 0 && parseInt(message.content) <= list.length) {
                            const taskToDelete = list[numToDel];
                            await taskSchema.deleteOne(list[numToDel]);
                            msg.reply("Successfully deleted task: `" + taskToDelete.message + "`.");
                        } else {
                            msg.reply("Please insert a proper number within the task list.")
                        }
                    } else {
                        msg.reply("Please insert a number.")
                    }
                    
                })
                .catch(collected => {
                    msg.channel.send('Timeout');
                });
            })
        }
    }
}

commands.taskEdit = async function(msg) {
    const receivedMsg = msg.content.replace("!taskedit", "").trim();

    if (receivedMsg === '') {
        const list = await taskSchema.find({
            author: msg.author.id
        })

        if (list.length === 0) {
            msg.reply("You do not have any saved task.");
        } else {
            let desc = "";
    
            for (var i = 0; i < list.length; i++) {
                desc += (i+1) + ": " + list[i].message + "\n";
            }
    
            let filter = m => m.author.id === msg.author.id
            msg.reply("Here is your list of task. Please reply with the number to edit followed by content to be edited, for example `2 do homework`:\n```" + desc + "```").then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    const num = parseInt(message.content.split(" ")[0])-1;

                    if (!isNaN(num)) {
                        if (parseInt(message.content) > 0 && parseInt(message.content) <= list.length) {
                            const newMsg = message.content.replace(message.content.split(" ")[0] + " ", "").trim();

                            if (message.content.split(" ").length < 2) {
                                msg.reply("Please edit the task properly and do not leave the task to be edited to be blank.");
                            } else {
                                const oldTask = list[num].message;

                                await taskSchema.updateOne(list[num], {
                                    message: newMsg,
                                });

                                const updatedList = await taskSchema.find({
                                    author: msg.author.id
                                })
                                const updatedTask = updatedList[num].message;
                        
                                msg.reply("successfully edited task `" + oldTask + "` to `" + updatedTask + "`.");
                            }
                        } else {
                            msg.reply("Please insert a proper number within the task list and ensure that it is `<task number> <message to edit>`, for example `2 do homework`.")
                        }
                    } else {
                        msg.reply("Please ensure it is `<task number> <message to edit>`, for example `2 do homework`.")
                    }
                })
                .catch(collected => {
                    msg.channel.send('Timeout');
                });
            })
        }
    }
}

module.exports = { UserCommand };