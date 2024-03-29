const Discord = require('discord.js');
const calculatorSchema = require('./calculatorSchema');
const userSchema = require('./userSchema');

commands = new Object();

commands.help = function(message, prefix) {
    let pages = [[{command: prefix + "gemsaddcategory <category name>", description: "Adds a new calculation category"},
                {command: prefix + "gemscategory", description: "Get a list of categories saved"},
                {command: prefix + "gemseditcategory", description: "Edit category name"},
                {command: prefix + "gemsdeletecategory", description: "Delete category"},
                {command: prefix + "gemsclearcategory", description: "Clear all categories added"},
                {command: prefix + "gemsaddcalculation <category number> <quantity> <amount> <description>", description: "Add calculation to the category"},
                {command: prefix + "gemseditcalculation <category number> <calculation number> <quantity> <amount> <description>", description: "Edit added calculation within the category"},
                {command: prefix + "gemsdeletecalculation", description: "Delete added calculation within the category"},
                {command: prefix + "gemsclearcalculation", description: "Clear all added calculations within the category"},
                {command: prefix + "gemscalculate", description: "Calculate the total amount of gems within a category"}],

                [{command: prefix + "gemslist", description: "Display all your saved categories and calculations in page format"},
                {command: prefix + "gemslistall", description: "Display all your saved categories and calculations"},
                {command: prefix + "gemscopy", description: "Copy your existing calculations from 1 category into new category"}]
            ];
            
    let page = 1;
    const embed = new Discord.RichEmbed()
        .setTitle("Primogems Calculator Command List")
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

commands.addCategory = async function(msg, prefix, keyword) {
    const msgContent = msg.content.replace(prefix + keyword, "").trim();

    if (msgContent === '') {
        msg.reply("Please indicate a new title of calculations to be saved with `" + prefix + keyword + " <category title>`.");
    } else {
        await userSchema.create({
            author: msg.author.id,
            title: msgContent
        });

        const list = await userSchema.find({
            author: msg.author.id
        })

        let desc = "";
        for (var i = 0; i < list.length; i++) {
            desc += (i+1) + ": " + list[i].title + "\n";
        }

        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems Calculator List", msg.author.avatarURL)
            .setTitle("Primogems Calculator Command: Add category")
            .addField("Successfully added new category:", msgContent)
            .addField("Here are list of categories you have saved:", desc)
            .setColor(0xF1C40F)
        msg.channel.send(embed);
    }
}

commands.getCategory = async function(msg, prefix, keyword) {
    const list = await userSchema.find({
        author: msg.author.id
    })

    let desc = "";
    for (var i = 0; i < list.length; i++) {
        desc += (i+1) + ": " + list[i].title + "\n";
    }

    const embed = new Discord.RichEmbed()
        .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems Calculator List", msg.author.avatarURL)
        .setTitle("Primogems Calculator Command: Get category")
        .addField("Here are list of categories you have saved:", desc)
        .setColor(0xF1C40F)
    msg.channel.send(embed);
}

commands.editCategory = async function(msg, prefix, keyword) {
    const msgContent = msg.content.replace(prefix + keyword, "").trim();

    if (msgContent === '') {
        const list = await userSchema.find({
            author: msg.author.id
        })

        if (list.length <= 0) {
            msg.reply("You do not have any saved category.");
        } else {
            let desc = "";
            for (var i = 0; i < list.length; i++) {
                desc += (i+1) + ": " + list[i].title + "\n";
            }

            let filter = m => m.author.id === msg.author.id;

            msg.reply("Please edit category name with `<category number> <new name>`.")
            const embed = new Discord.RichEmbed()
                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems Calculator List", msg.author.avatarURL)
                .setTitle("Primogems Calculator Command: Edit category")
                .addField("Here are list of categories you have saved:", desc)
                .setColor(0xF1C40F)
            msg.channel.send(embed).then(() => {
                msg.channel.awaitMessages(filter, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                    })
                    .then(async message => {
                        message = message.first();
                        const num = parseInt(message.content)-1;
                        
                        if (!isNaN(num)) {
                            if (num+1 > 0 && num+1 <= list.length) {
                                const newMsg = message.content.replace(message.content.split(" ")[0] + " ", "").trim();

                                if (message.content.split(" ").length < 2) {
                                    msg.reply("Please edit the task properly and do not leave the task to be edited to be blank.");
                                } else {
                                    const oldTask = list[num].title;

                                    await userSchema.updateOne(list[num], {
                                        title: newMsg,
                                    });

                                    const updatedList = await userSchema.find({
                                        author: msg.author.id
                                    })
                                    const updatedTask = updatedList[num].title;
                            
                                    msg.reply("successfully edited category `" + oldTask + "` to `" + updatedTask + "`.");
                                }

                            } else {
                                msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a proper number within the category list.")
                            }
                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a number.")
                        }
                        
                    })
                    .catch(collected => {
                        msg.reply("Timeout. Please redo the command again.");
                    });
                })
            }

    }
}

commands.deleteCategory = async function(msg, prefix, keyword) {
    const msgContent = msg.content.replace(prefix + keyword, "").trim();

    if (msgContent === '') {
        const list = await userSchema.find({
            author: msg.author.id
        })

        let desc = "";
        for (var i = 0; i < list.length; i++) {
            desc += (i+1) + ": " + list[i].title + "\n";
        }

        let filter = m => m.author.id === msg.author.id;

        msg.reply("Please reply with the number to delete.")
        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems Calculator List", msg.author.avatarURL)
            .setTitle("Primogems Calculator Command: Delete category")
            .addField("Here are list of categories you have saved:", desc)
            .setColor(0xF1C40F)
        msg.channel.send(embed).then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    const num = parseInt(message.content)-1;
                    
                    if (!isNaN(num)) {
                        
                        if (num+1 > 0 && num+1 <= list.length) {
                            const taskToDelete = list[num];
                            await userSchema.deleteOne(list[num]);
                            await calculatorSchema.deleteMany({category: taskToDelete._id});

                            msg.reply("Successfully deleted category: `" + taskToDelete.title + "` and its corresponding calculations.");

                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a proper number within the category list.")
                        }
                    } else {
                        msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a number.")
                    }
                    
                })
                .catch(collected => {
                    msg.reply("Timeout. Please redo the command again.");
                });
            })
        
    }
}

commands.clearCategory = async function(msg, prefix, keyword) {
    const msgContent = msg.content.replace(prefix + keyword, "").trim();

    if (msgContent === '') {
        let filter = m => m.author.id === msg.author.id
        msg.reply("Are you sure you want to delete all your saved categories and calculations? Initiating this action is irreversible. Reply `yes` to delete all, reply `no` to cancel.").then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    const receivedMsg = message.content.split(" ")[0];

                    if (receivedMsg.toLowerCase() === 'yes') {
                        await userSchema.deleteMany({author: msg.author.id}).then(async res => {
                            await calculatorSchema.deleteMany({author: msg.author.id}).then(() => {
                                msg.reply("Successfully cleared all categories.")
                            })
                        })
                    } else if (receivedMsg.toLowerCase() === 'no') {
                        msg.reply("`" + prefix + keyword + "` command cancelled.");
                    } else {
                        msg.reply("Please redo the command `" + prefix + keyword + "` again if you wish to delete all your saved categories and calculations.");
                    }

                }).catch(collected => {
                    msg.reply("Timeout. Please redo the command again.");
                });
        })
    }
}

commands.addCalculation = async function(msg, prefix, keyword) {
    const msgContent = msg.content.replace(prefix + keyword, "").trim();

    const list = await userSchema.find({
        author: msg.author.id
    })

    let desc = "";
    for (var i = 0; i < list.length; i++) {
        desc += (i+1) + ": " + list[i].title + "\n";
    }

    if (msgContent === '') {
        msg.reply("Please add new gems calculation with `" + prefix + keyword + " <category number> <quantity> <amount> <description>`, for example `"
        + prefix + keyword + " 2 10 150 Daily commission and welkin`.");

        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems Category List", msg.author.avatarURL)
            .setTitle("Primogems Calculator Command: Add calculation")
            .addField("Here are list of categories you have saved:", desc)
            .setColor(0xF1C40F)
        msg.channel.send(embed);
    } else {
        try {
            const categoryNum = parseInt(msgContent.split(" ")[0]) - 1;
            const quantity = parseInt(msgContent.split(" ")[1]);
            const amount = parseInt(msgContent.split(" ")[2]);
            const description = msgContent.replace((categoryNum+1) + " " + quantity + " " + amount + " ", "").trim();
            
            const categoryList = await userSchema.find({
                author: msg.author.id
            })
            
            if (!isNaN(categoryNum) && !isNaN(quantity) && !isNaN(amount)) {
                if (categoryNum+1 > 0 && categoryNum+1 <= categoryList.length) {
                    await calculatorSchema.create({
                        quantity: quantity,
                        amount: amount,
                        description: description,
                        author: msg.author.id,
                        category: categoryList[categoryNum]
                    }).then(res => {
                        msg.reply("Successfully added new calculation `" + res.description + "` to category `" + res.category.title + "`.");
                    })
                } else {
                    msg.reply("Category number out of range. Please retry adding new gems calculation with `" + prefix + keyword + " <category number> <quantity> <amount> <description>`, for example `"
                    + prefix + keyword + " 2 10 150 Daily commission and welkin`.");

                    const embed = new Discord.RichEmbed()
                        .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems Category List", msg.author.avatarURL)
                        .setTitle("Primogems Calculator Command: Add calculation")
                        .addField("Here are list of categories you have saved:", desc)
                        .setColor(0xF1C40F)
                    msg.channel.send(embed);

                }
            }
        } catch (e) {
            msg.reply("Please retry adding new gems calculation with `" + prefix + keyword + " <category number> <quantity> <amount> <description>`, for example `"
                + prefix + keyword + " 2 10 150 Daily commission and welkin`.");
        }
    }
}

commands.editCalculation = async function(msg, prefix, keyword) {
    const msgContent = msg.content.replace(prefix + keyword, "").trim();

    const list = await userSchema.find({
        author: msg.author.id
    })

    let desc = "";
    for (var i = 0; i < list.length; i++) {
        desc += (i+1) + ": " + list[i].title + "\n";
    }

    if (msgContent === '') {
        msg.reply("Please edit new gems calculation with `" + prefix + keyword + " <category number> <calculation number> <quantity> <amount> <description>`, for example `"
        + prefix + keyword + " 1 2 1 100 dailies`. Get consolidated category and calculation list with `!gemslist`.");
    } else {
        try {
            const categoryNum = parseInt(msgContent.split(" ")[0]) - 1;
            const calculationNum = parseInt(msgContent.split(" ")[1]) - 1;
            const quantity = parseInt(msgContent.split(" ")[2]);
            const amount = parseInt(msgContent.split(" ")[3]);
            const description = msgContent.replace((categoryNum+1) + " " + (calculationNum+1) + " " + quantity + " " + amount + " ", "").trim();
            
            const userList = await userSchema.find({
                author: msg.author.id
            })

            const categoryToGet = userList[categoryNum]._id;

            const calculationList = await calculatorSchema.find({
                category: categoryToGet
            });
            
            if (!isNaN(categoryNum) && !isNaN(calculationNum) && !isNaN(quantity) && !isNaN(amount)) {
                if (calculationList.length > 0) {
                    if (calculationNum+1 > 0 && calculationNum+1 <= calculationList.length) {
                        await calculatorSchema.updateOne(calculationList[calculationNum], {
                            quantity: quantity,
                            amount: amount,
                            description: description
                        }).then(async res => {
                            msg.reply("Successfully edited. Here is your current " + userList[categoryNum].title + "'s list:");

                            const updatedCalculationList = await calculatorSchema.find({
                                category: categoryToGet
                            });
                            
                            const embed = new Discord.RichEmbed()
                                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems calculator", msg.author.avatarURL)
                                .setColor(0xF1C40F)

                            let totalGemsNeeded = 0;

                            for (var i = 0; i < updatedCalculationList.length; i++) {
                                totalGemsNeeded += (updatedCalculationList[i].quantity * updatedCalculationList[i].amount);
                                embed.addField((i+1) + ": " + updatedCalculationList[i].description,  "Quantity: " + updatedCalculationList[i].quantity + ", Amount: " + updatedCalculationList[i].amount + ", Total: " + (updatedCalculationList[i].quantity * updatedCalculationList[i].amount));
                            }

                            embed.setTitle(userList[categoryNum].title + "'s Primogem list");
                            embed.setDescription("**Total number of rolls: " + Math.floor(totalGemsNeeded/160) + "\nTotal Number of Primogems: " + totalGemsNeeded + "**");

                            msg.channel.send(embed);
                        })
                    } else {
                        msg.reply("Please correctly indicate a calculation number to edit.");
                    }
                } else {
                    msg.reply("There is no calculation to edit. Please add a new calculation to the category first.");
                }
            }
        } catch (e) {
            msg.reply("Please make sure you have properly entered the bot command. Input `" + prefix + keyword + "` to get command steps again.")
        }
    }
}

commands.deleteCalculation = async function(msg, prefix, keyword) {
    const msgContent = msg.content.replace(prefix + keyword, "").trim();

    const list = await userSchema.find({
        author: msg.author.id
    })

    let desc = "";
    for (var i = 0; i < list.length; i++) {
        desc += (i+1) + ": " + list[i].title + "\n";
    }

    if (msgContent === '') {
        msg.reply("Please delete gems calculation with `" + prefix + keyword + " <category number> <calculation number>`, for example `"
        + prefix + keyword + " 1 2`. Get consolidated category and calculation list with `!gemslist`.");
    } else {
        try {
            const categoryNum = parseInt(msgContent.split(" ")[0]) - 1;
            const calculationNum = parseInt(msgContent.split(" ")[1]) - 1;
            
            const userList = await userSchema.find({
                author: msg.author.id
            })

            const categoryToGet = userList[categoryNum]._id;

            const calculationList = await calculatorSchema.find({
                category: categoryToGet
            });
            
            if (!isNaN(categoryNum) && !isNaN(calculationNum)) {
                if (calculationList.length > 0) {
                    const deletedCalculation = calculationList[calculationNum];
                    
                    await calculatorSchema.deleteOne(calculationList[calculationNum]).then(async res => {
                        console.log(res);
                        msg.reply("Successfully deleted `" + deletedCalculation.description + "`. Here is your current " + userList[categoryNum].title + "'s list:");

                        const updatedCalculationList = await calculatorSchema.find({
                            category: categoryToGet
                        });
                        
                        const embed = new Discord.RichEmbed()
                            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems calculator", msg.author.avatarURL)
                            .setColor(0xF1C40F)

                        let totalGemsNeeded = 0;

                        for (var i = 0; i < updatedCalculationList.length; i++) {
                            totalGemsNeeded += (updatedCalculationList[i].quantity * updatedCalculationList[i].amount);
                            embed.addField((i+1) + ": " + updatedCalculationList[i].description,  "Quantity: " + updatedCalculationList[i].quantity + ", Amount: " + updatedCalculationList[i].amount + ", Total: " + (updatedCalculationList[i].quantity * updatedCalculationList[i].amount));
                        }

                        embed.setTitle(userList[categoryNum].title + "'s Primogem list");
                        embed.setDescription("**Total number of rolls: " + Math.floor(totalGemsNeeded/160) + "\nTotal Number of Primogems: " + totalGemsNeeded + "**");

                        msg.channel.send(embed);
                    })
                } else {
                    msg.reply("There is no calculation to delete. Please add a new calculation to the category first.");
                }
            }
        } catch (e) {
            console.log(e);
            msg.reply("Please make sure you have properly entered the bot command. Input `" + prefix + keyword + "` to get command steps again.")
        }
    }
}

commands.clearCalculation = async function(msg, prefix, keyword) {
    const msgContent = msg.content.replace(prefix + keyword, "").trim();

    if (msgContent === '') {
        const list = await userSchema.find({
            author: msg.author.id
        })

        let desc = "";
        for (var i = 0; i < list.length; i++) {
            desc += (i+1) + ": " + list[i].title + "\n";
        }

        let filter = m => m.author.id === msg.author.id
        msg.reply("Please delete gems calculation with `<category number>`, for example `1`. To cancel command, type `cancel`.")
        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems Calculator List", msg.author.avatarURL)
            .setTitle("Primogems Calculator Command: Clear calculation")
            .addField("Here are list of categories you have saved:", desc)
            .setColor(0xF1C40F)
        msg.channel.send(embed).then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    const categoryNum = parseInt(message.content) - 1;
                    
                    const userList = await userSchema.find({
                        author: msg.author.id
                    })
                    
                    if (!isNaN(categoryNum)) {
                        if (categoryNum+1 > 0 && categoryNum+1 <= userList.length) {
                            const categoryToGet = userList[categoryNum]._id;
    
                            const calculationList = await calculatorSchema.find({
                                category: categoryToGet
                            });

                            if (calculationList.length > 0) {
                                await calculatorSchema.deleteMany({category: calculationList[0].category}).then(async res => {
                                    msg.reply("Successfully deleted every calculations saved in `" + userList[categoryNum].title + "`.");
                                })
                            } else {
                                msg.reply("There is no calculation to clear. Please add a new calculation to the category first.");
                            }
                        } else {
                            msg.reply("Category number out of range. Please redo the command `" + prefix + keyword + "` again.")
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

commands.calculateCategory = async function(msg, prefix, keyword) {
    const msgContent = msg.content.replace(prefix + keyword, "").trim();

    if (msgContent === '') {
        const list = await userSchema.find({
            author: msg.author.id
        })
        if (list.length <= 0) {
            msg.reply("You do not have any saved category.");
        } else {
            
        
            let desc = "";
            for (var i = 0; i < list.length; i++) {
                desc += (i+1) + ": " + list[i].title + "\n";
            }
    
            let filter = m => m.author.id === msg.author.id
            msg.reply("Please indicate the category number to calculate. To cancel command, type `cancel`.");
            const embed = new Discord.RichEmbed()
                .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems Calculator List", msg.author.avatarURL)
                .setTitle("Primogems Calculator Command: Calculate category")
                .addField("Here are list of categories you have saved:", desc)
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
                            const categoryNum = parseInt(message.content)-1;
    
                            if (categoryNum+1 > list.length || categoryNum+1 <= 0) {
                                msg.reply("Please redo the command `" + prefix + keyword + "` again, then properly insert a number.")
                            } else {
                                const userList = await userSchema.find({
                                    author: msg.author.id
                                })
                                
                                const categoryToGet = userList[categoryNum]._id;
        
                                const calculationList = await calculatorSchema.find({
                                    category: categoryToGet
                                });
                                
                                const embed = new Discord.RichEmbed()
                                    .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems calculator", msg.author.avatarURL)
                                    .setColor(0xF1C40F)
        
                                let totalGemsNeeded = 0;
        
                                for (var i = 0; i < calculationList.length; i++) {
                                    totalGemsNeeded += (calculationList[i].quantity * calculationList[i].amount);
                                    embed.addField((i+1) + ": " + calculationList[i].description,  "Quantity: " + calculationList[i].quantity + ", Amount: " + calculationList[i].amount + ", Total: " + (calculationList[i].quantity * calculationList[i].amount));
                                }
        
                                embed.setTitle(userList[categoryNum].title + "'s Primogem list");
                                embed.setDescription("**Total number of rolls: " + Math.floor(totalGemsNeeded/160) + "\nTotal Number of Primogems: " + totalGemsNeeded + "**");


                                msg.channel.send(embed);
                            }
                        
                        } else {
                            if (message.content.split(" ")[0].toLowerCase() === 'cancel') {
                                msg.reply("`" + prefix + keyword + "` command cancelled.");
                            } else {
                                msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a number.");
                            }
                        }
    
                    }).catch(collected => {

                    })
            
                })
        }
        
    }
}

commands.getGemsListAll = async function(msg, prefix, keyword) {
    const userList = await userSchema.find({
        author: msg.author.id
    })

    if (userList.length === 0) {
        msg.reply("You have no saved category.");
    }

    for (var j = 0; j < userList.length; j++) {
        const categoryToGet = userList[j]._id;

        const calculationList = await calculatorSchema.find({
            category: categoryToGet
        });
        
        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems calculator", msg.author.avatarURL)
            .setColor(0xF1C40F)

        let totalGemsNeeded = 0;

        for (var i = 0; i < calculationList.length; i++) {
            totalGemsNeeded += (calculationList[i].quantity * calculationList[i].amount);
            embed.addField((i+1) + ": " + calculationList[i].description,  "Quantity: " + calculationList[i].quantity + ", Amount: " + calculationList[i].amount + ", Total: " + (calculationList[i].quantity * calculationList[i].amount));
        }

        embed.setTitle("[" + (j+1) + "] " + userList[j].title + "'s Primogem list");
        embed.setDescription("**Total number of rolls: " + Math.floor(totalGemsNeeded/160) + "\nTotal Number of Primogems: " + totalGemsNeeded + "**");        
        
        msg.channel.send(embed);
    }
}

commands.getGemsList = async function(message, prefix, keyword) {
    let pages = [];

    const userList = await userSchema.find({
        author: message.author.id
    })

    if (userList.length === 0) {
        message.reply("You have no saved category.");
    } else {
        for (var j = 0; j < userList.length; j++) {
            const categoryToGet = userList[j]._id;
    
            const calculationList = await calculatorSchema.find({
                category: categoryToGet
            });
    
            let totalGemsNeeded = 0;
    
            let temporaryCalculation = [];
    
            for (var i = 0; i < calculationList.length; i++) {
                totalGemsNeeded += (calculationList[i].quantity * calculationList[i].amount);
                temporaryCalculation.push({
                    calculationNumber: i+1,
                    description: calculationList[i].description,
                    quantity: calculationList[i].quantity,
                    amount: calculationList[i].amount,
                    total: totalGemsNeeded
                });
            }
    
            pages.push({
                categoryNumber: j+1,
                title: userList[j].title,
                total: totalGemsNeeded,
                calculation: temporaryCalculation
            })
        }
    
        //Move embed page forward/backward
        let page = 1;
        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username + "#" + message.author.discriminator + "'s Primogems calculator", message.author.avatarURL)
            .setColor(0xF1C40F)
            .setFooter(`Page ${page} of ${pages.length}`)
    
        //Initialize page 1
        embed.setTitle("[" + pages[page-1].categoryNumber + "] " + pages[page-1].title + "'s Primogems List");
        embed.setDescription("**Total number of rolls: " + Math.floor(pages[page-1].total/160) + 
                            "\nTotal number of Primogems: " + pages[page-1].total + "**");
        
        for (var i = 0; i < pages[page-1].calculation.length; i++) {
           embed.addField((i+1) + ": " + pages[page-1].calculation[i].description, "Quantity: " + pages[page-1].calculation[i].quantity + ", Amount: " + pages[page-1].calculation[i].amount + ", Total: " + (pages[page-1].calculation[i].quantity * pages[page-1].calculation[i].amount));
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
    
                    embed.setTitle("[" + pages[page-1].categoryNumber + "] " + pages[page-1].title + "'s Primogems List");
                    embed.setDescription("**Total number of rolls: " + Math.floor(pages[page-1].total/160) + 
                                        "\nTotal number of Primogems: " + pages[page-1].total + "**");
                    
                    for (var i = 0; i < pages[page-1].calculation.length; i++) {
                    embed.addField((i+1) + ": " + pages[page-1].calculation[i].description, "Quantity: " + pages[page-1].calculation[i].quantity + ", Amount: " + pages[page-1].calculation[i].amount + ", Total: " + (pages[page-1].calculation[i].quantity * pages[page-1].calculation[i].amount));
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
    
                    embed.setTitle("[" + pages[page-1].categoryNumber + "] " + pages[page-1].title + "'s Primogems List");
                    embed.setDescription("**Total number of rolls: " + Math.floor(pages[page-1].total/160) + 
                                        "\nTotal number of Primogems: " + pages[page-1].total + "**");
                    
                    for (var i = 0; i < pages[page-1].calculation.length; i++) {
                    embed.addField((i+1) + ": " + pages[page-1].calculation[i].description, "Quantity: " + pages[page-1].calculation[i].quantity + ", Amount: " + pages[page-1].calculation[i].amount + ", Total: " + (pages[page-1].calculation[i].quantity * pages[page-1].calculation[i].amount));
                    }
    
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    msg.edit(embed);
    
                    r.remove(message.author.id);
                });
            });
        });
    }
}

commands.copyCategory = async function(msg, prefix, keyword) {
    const msgContent = msg.content.replace(prefix + keyword, "").trim();

    const userList = await userSchema.find({
        author: msg.author.id
    })

    if (msgContent === '') {
        let desc = "";
        for (var i = 0; i < userList.length; i++) {
            desc += (i+1) + ": " + userList[i].title + "\n";
        }


        let filter = m => m.author.id === msg.author.id
        msg.reply("Please insert `<category number> <new title>`, for example, `1 Ayato` to copy category number 1 with new category title. To cancel command, type `cancel`.");
        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username + "#" + msg.author.discriminator + "'s Primogems Calculator List", msg.author.avatarURL)
            .setTitle("Primogems Calculator Command: Copy category")
            .addField("Here are list of categories you have saved:", desc)
            .setColor(0xF1C40F)
        msg.channel.send(embed).then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    message = message.first();
                    const categoryNum = parseInt(message.content) - 1;
                    if (!isNaN(categoryNum)) {
                        if (categoryNum+1 > 0 && categoryNum+1 <= userList.length) {
                            const newCategoryTitle = message.content.replace((categoryNum+1) + " ", "").trim();

                            const categoryID = userList[categoryNum]._id;

                            const categoryListToCopy = await calculatorSchema.find({
                                category: categoryID
                            })
                    
                            //Create new category
                            await userSchema.create({
                                author: msg.author.id,
                                title: newCategoryTitle
                            }).then(async res => {
                                const newID = res._id;
                    
                                for (var i = 0; i < categoryListToCopy.length; i++) {
                                    await calculatorSchema.create({
                                        quantity: categoryListToCopy[i].quantity,
                                        amount: categoryListToCopy[i].amount,
                                        description: categoryListToCopy[i].description,
                                        author: msg.author.id,
                                        category: newID
                                    });
                                }
                    
                                msg.reply("Successfully copied calculations from `" + userList[categoryNum].title + "` to `" + res.title + "`.");
                            })
                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a proper number followed by new category title.")
                        }
                    } else {
                        if (message.content.split(" ")[0].toLowerCase() === 'cancel') {
                            msg.reply("`" + prefix + keyword + "` command cancelled.");
                        } else {
                            msg.reply("Please redo the command `" + prefix + keyword + "` again, then insert a number followed by new category title.");
                        }
                    }
                    
                })
                .catch(collected => {
                    msg.reply("Timeout. Please redo the command again.");
                });
            
        })
    }
}

module.exports = { commands };
