const Discord = require('discord.js');
const todolistSchema = require('./todolistschema')

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
        case 'savetask':
            commands.saveTask(msg);
            break;
        case 'gettask':
            commands.getTask(msg);
            break;
        case 'deltask':
            commands.deleteTask(msg);
            break;
        case 'edittask':
            commands.editTask(msg);
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

commands.saveTask = async function(msg) {
    const newMsg = msg.content.replace("!savetask", "").trim();

    /*setTimeout(async () => {
        await todolistSchema.create({
            message: newMsg,
            author: msg.author.id,
        })
    }, 1000); */
    await todolistSchema.create({
        message: newMsg,
        author: msg.author.id,
    });

    msg.reply("Successfully saved task.");
}

commands.getTask = async function(msg) {
    const list = await todolistSchema.find({
        author: msg.author.id
    })

    let desc = "";

    for (var i = 0; i < list.length; i++) {
        desc += (i+1) + ": " + list[i].message + "\n";
    }

    msg.reply("Task saved: \n" + desc);
}

commands.deleteTask = async function(msg) {
    const newMsg = msg.content.replace("!deltask", "").trim();

    if (newMsg === '') {
        const list = await todolistSchema.find({
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
            msg.reply("Here is your list of task. Please reply with the number to delete:\n" + desc).then(() => {
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
                })
                .then(async message => {
                    const numToDel = parseInt(message.content)-1;
                    await todolistSchema.deleteOne(list[numToDel]);
                    msg.reply("successfully deleted task.")
                })
                .catch(collected => {
                    msg.channel.send('Timeout');
                });
            })
        }
    }
}

commands.editTask = async function(msg) {
    const receivedMsg = msg.content.replace("!edittask", "").trim();
    const num = parseInt(receivedMsg.split(" ")) - 1;
    const newMsg = msg.content.replace("!edittask", "").replace(receivedMsg.split(" ")[0] + " ", "").trim();

    if (receivedMsg === '') {
        
    } else {
        const list = await todolistSchema.find({
            author: msg.author.id
        })
    
        await todolistSchema.updateOne(list[num], {
                message: newMsg,
            });
        msg.reply("successfully edited task.")
    }
}

module.exports = { UserCommand };