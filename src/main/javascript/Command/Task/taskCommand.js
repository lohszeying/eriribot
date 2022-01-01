const Discord = require('discord.js');
const taskSchema = require('./taskSchema');

taskList = new Object();

taskList.add = async function(msg, prefix, keyword) {
    const newMsg = msg.content.replace(prefix + keyword, "").trim();

    if (newMsg === '') {
        msg.reply("Please indicate a task to be saved.");
    } else {
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

        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
            .setTitle("Task Command: Add")
            .addField("Successfully saved task:", newMsg)
            .addField("Here are list of tasks you have saved:", desc)
            .setColor(0xF1C40F)
        msg.reply(embed);
    }
}

taskList.list = async function(msg) {
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

        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
            .setTitle("Task Command: List")
            .addField("Here are list of tasks you have saved:", desc)
            .setColor(0xF1C40F)
        msg.reply(embed);
    }
}

taskList.delete = async function(msg, prefix, keyword) {
    const newMsg = msg.content.replace(prefix + keyword, "").trim();

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
            const embed = new Discord.RichEmbed()
                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
                .setTitle("Task Command: Delete")
                .addField("Here is your list of task. Please reply with the number to delete:", "```" + desc + "```")
                .setColor(0xF1C40F)
            msg.reply(embed).then(() => {
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
                        msg.reply("Please redo the command again, then insert a number.")
                    }
                    
                })
                .catch(collected => {
                    msg.reply("Timeout. Please redo the command again.");
                });
            })
        }
    }
}

taskList.clear = async function(msg) {
    const list = await taskSchema.find({
        author: msg.author.id
    })

    if (list.length === 0) {
        msg.reply("You do not have any saved task.");
    } else {
        await taskSchema.deleteMany({});
        msg.reply("Successfully deleted all tasks saved.");
    }
    
}

taskList.edit = async function(msg, prefix, keyword) {
    const receivedMsg = msg.content.replace(prefix + keyword, "").trim();

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

            const embed = new Discord.RichEmbed()
                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
                .setTitle("Task Command: Edit")
                .addField("Here is your list of task. Please reply with the number to edit followed by content to be edited, for example `2 do homework`:", desc)
                .setColor(0xF1C40F)
            msg.reply(embed).then(() => {
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
                    msg.reply("Timeout. Please redo the command again.");
                });
            })
        }
    }
}

module.exports = { taskList };