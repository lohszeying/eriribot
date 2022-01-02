const Discord = require('discord.js');
const taskSchema = require('./taskSchema');

commands = new Object();

commands.add = async function(msg, prefix, keyword) {
    const newMsg = msg.content.replace(prefix + keyword, "").trim();

    if (newMsg === '') {
        msg.reply("Please indicate a task to be saved with `!taskadd <task name>`.");
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
            let completed = "";
            if (list[i].completed) {
                //Task completed
                completed = ":white_check_mark:";
            } else {
                completed = ":regional_indicator_x:";
            }

            desc += completed + " " + (i+1) + ": " + list[i].message + "\n";
        }

        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
            .setTitle("Task Command: Add")
            .addField("Successfully saved task:", newMsg)
            .addField("Here are list of tasks you have saved:", desc)
            .setColor(0xF1C40F)
        msg.channel.send(embed);
    }
}

commands.list = async function(msg) {
    const list = await taskSchema.find({
        author: msg.author.id
    })

    if (list.length === 0) {
        msg.reply("You do not have any saved task.");
    } else {
        let desc = "";

        for (var i = 0; i < list.length; i++) {
            let completed = "";
            if (list[i].completed) {
                //Task completed
                completed = ":white_check_mark:";
            } else {
                completed = ":regional_indicator_x:";
            }

            desc += completed + " " + (i+1) + ": " + list[i].message + "\n";
        }

        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
            .setTitle("Task Command: List")
            .addField("Here are list of tasks you have saved:", desc)
            .setColor(0xF1C40F)
        msg.channel.send(embed);
    }
}

commands.delete = async function(msg, prefix, keyword) {
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
                let completed = "";
                if (list[i].completed) {
                    //Task completed
                    completed = ":white_check_mark:";
                } else {
                    completed = ":regional_indicator_x:";
                }

                desc += completed + " " + (i+1) + ": " + list[i].message + "\n";
            }
            
            msg.reply("Please reply with the number to delete, for example `2` to delete the second item in your task list. To cancel command, type `cancel`.")
            let filter = m => m.author.id === msg.author.id
            const embed = new Discord.RichEmbed()
                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
                .setTitle("Task Command: Delete")
                .addField("Here is your list of task:", desc)
                .setColor(0xF1C40F)
            msg.channel.send(embed).then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    
                    if (!isNaN(message)) {
                        const num = parseInt(message.content)-1;

                        if (num+1 > 0 && num+1 <= list.length) {
                            const taskToDelete = list[num];
                            await taskSchema.deleteOne(list[num]);
                            msg.reply("Successfully deleted task: `" + taskToDelete.message + "`.");
                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a proper number within the task list.")
                        }
                    } else {
                        if (message.content.split(" ")[0].toLowerCase() === 'cancel') {
                            msg.reply("`" + prefix + keyword + "` command cancelled.");
                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a number.");
                        }
                    }
                    
                })
                .catch(collected => {
                    msg.reply("Timeout. Please redo the command again.");
                });
            })
        }
    }
}

commands.clear = async function(msg, prefix, keyword) {
    const list = await taskSchema.find({
        author: msg.author.id
    })

    if (list.length === 0) {
        msg.reply("You do not have any saved task.");
    } else {
        let filter = m => m.author.id === msg.author.id
        msg.reply("Are you sure you want to delete all your saved tasks? Initiating this action is irreversible. Reply `yes` to delete all, reply `no` to cancel.").then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    const receivedMsg = message.content.split(" ")[0];

                    if (receivedMsg.toLowerCase() === 'yes') {
                        await taskSchema.deleteMany({});
                        msg.reply("Successfully deleted all tasks saved.");
                    } else if (receivedMsg.toLowerCase() === 'no') {
                        msg.reply("`" + prefix + keyword + "` command cancelled.");
                    } else {
                        msg.reply("Please redo the command `" + prefix + keyword + "` again if you wish to delete all your saved tasks.");
                    }

                }).catch(collected => {
                    console.log(collected);
                    msg.reply("Timeout. Please redo the command again.");
                });
        })



        
    }
    
}

commands.edit = async function(msg, prefix, keyword) {
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
                let completed = "";
                if (list[i].completed) {
                    //Task completed
                    completed = ":white_check_mark:";
                } else {
                    completed = ":regional_indicator_x:";
                }
    
                desc += completed + " " + (i+1) + ": " + list[i].message + "\n";
            }
    
            let filter = m => m.author.id === msg.author.id

            msg.reply("Please reply with the number to edit followed by content to be edited, for example `2 do homework`. To cancel command, type `cancel`.")
            const embed = new Discord.RichEmbed()
                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
                .setTitle("Task Command: Edit")
                .addField("Here is your list of task:", desc)
                .setColor(0xF1C40F)
            msg.channel.send(embed).then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    const num = parseInt(message.content.split(" ")[0])-1;

                    if (!isNaN(num)) {
                        if (num+1 > 0 && num+1 <= list.length) {
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
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a proper number within the task list and ensure that it is `<task number> <message to edit>`, for example `2 do homework`.")
                        }
                    } else {
                        if (message.content.split(" ")[0].toLowerCase() === 'cancel') {
                            msg.reply("`" + prefix + keyword + "` command cancelled.")
                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then ensure it is `<task number> <message to edit>`, for example `2 do homework`.")
                        }
                    }
                })
                .catch(collected => {
                    msg.reply("Timeout. Please redo the command again.");
                });
            })
        }
    }
}

commands.markComplete = async function(msg, prefix, keyword) {
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
                let completed = "";
                if (list[i].completed) {
                    //Task completed
                    completed = ":white_check_mark:";
                } else {
                    completed = ":regional_indicator_x:";
                }

                desc += completed + " " + (i+1) + ": " + list[i].message + "\n";
            }
            

            msg.reply("Please reply with the number to mark task as complete. To cancel command, type `cancel`.")
            let filter = m => m.author.id === msg.author.id
            const embed = new Discord.RichEmbed()
                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
                .setTitle("Task Command: Mark Complete")
                .addField("Here is your list of task:", desc)
                .setColor(0xF1C40F)
            msg.channel.send(embed).then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    
                    if (!isNaN(message)) {
                        const num = parseInt(message.content)-1;
                        if (num+1 > 0 && num+1 <= list.length) {
                            const task = list[num].message;

                            await taskSchema.updateOne(list[num], {
                                completed: true,
                            });

                            msg.reply("Successfully updated task status for `" + task + "` to :white_check_mark:.");
                            
                            const updatedList = await taskSchema.find({
                                author: msg.author.id
                            })

                            let updatedDesc = "";
    
                            for (var i = 0; i < updatedList.length; i++) {
                                let completed = "";
                                if (updatedList[i].completed) {
                                    //Task completed
                                    completed = ":white_check_mark:";
                                } else {
                                    completed = ":regional_indicator_x:";
                                }

                                updatedDesc += completed + " " + (i+1) + ": " + updatedList[i].message + "\n";
                            }

                            const updatedEmbed = new Discord.RichEmbed()
                                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
                                .setTitle("Task Command: Mark Complete updated")
                                .addField("Here is your updated list of task.", updatedDesc)
                                .setColor(0xF1C40F)
                            msg.channel.send(updatedEmbed);

                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a proper number within the task list.")
                        }
                    } else {
                        if (message.content.split(" ")[0].toLowerCase() === 'cancel') {
                            msg.reply("`" + prefix + keyword + "` command cancelled.");
                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a number.");
                        }
                    }
                    
                })
                .catch(collected => {
                    msg.reply("Timeout. Please redo the command again.");
                });
            })
        }
    }
}

commands.markIncomplete = async function(msg, prefix, keyword) {
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
                let completed = "";
                if (list[i].completed) {
                    //Task completed
                    completed = ":white_check_mark:";
                } else {
                    completed = ":regional_indicator_x:";
                }

                desc += completed + " " + (i+1) + ": " + list[i].message + "\n";
            }

            msg.reply("Please reply with the number to mark task as incomplete. To cancel command, type `cancel`.");
            let filter = m => m.author.id === msg.author.id;
            const embed = new Discord.RichEmbed()
                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
                .setTitle("Task Command: Mark Complete")
                .addField("Here is your list of task:", desc)
                .setColor(0xF1C40F)
            msg.channel.send(embed).then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    
                    if (!isNaN(message)) {
                        const num = parseInt(message.content)-1;

                        if (num+1 > 0 && num+1 <= list.length) {
                            const task = list[num].message;

                            await taskSchema.updateOne(list[num], {
                                completed: false,
                            });

                            msg.reply("Successfully updated task status for `" + task + "` to :regional_indicator_x:.");
                            
                            const updatedList = await taskSchema.find({
                                author: msg.author.id
                            })

                            let updatedDesc = "";
    
                            for (var i = 0; i < updatedList.length; i++) {
                                let completed = "";
                                if (updatedList[i].completed) {
                                    //Task completed
                                    completed = ":white_check_mark:";
                                } else {
                                    completed = ":regional_indicator_x:";
                                }

                                updatedDesc += completed + " " + (i+1) + ": " + updatedList[i].message + "\n";
                            }

                            const updatedEmbed = new Discord.RichEmbed()
                                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Task List", msg.author.avatarURL)
                                .setTitle("Task Command: Mark Incomplete updated")
                                .addField("Here is your updated list of task.", updatedDesc)
                                .setColor(0xF1C40F)
                            msg.channel.send(updatedEmbed);

                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a proper number within the task list.")
                        }
                    } else {
                        if (message.content.split(" ")[0].toLowerCase() === 'cancel') {
                            msg.reply("`" + prefix + keyword + "` command cancelled.");
                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a number.");
                        }
                    }
                    
                })
                .catch(collected => {
                    msg.reply("Timeout. Please redo the command again.");
                });
            })
        }
    }
}

module.exports = { commands };