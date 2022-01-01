const taskCommand = require('./Command/Task/taskCommand');
const miscCommand = require('./Command/Misc/miscCommand');

function UserCommand(msg, prefix, arg) {
    const keyword = arg[0];
    switch (keyword) {
        case 'ping':
            miscCommand.commands.ping(msg);
            break;
        case 'randomnum':
            miscCommand.commands.randomNum(msg);
            break;
        case 'embed':
            miscCommand.commands.embed(msg);
            break;
        case 'help':
            miscCommand.commands.help(msg, prefix);
            break;
        case 'react':
            miscCommand.commands.react(msg);
            break;
        case 'whatismyusername':
            miscCommand.commands.whatIsMyUsername(msg);
            break;
        case 'echo':
            miscCommand.commands.echo(msg);
            break;
        case 'taskadd':
            taskCommand.commands.add(msg, prefix, keyword);
            break;
        case 'taskl':
            taskCommand.commands.list(msg);
            break;
        case 'taskdel':
            taskCommand.commands.delete(msg, prefix, keyword);
            break;
        case 'taskclear':
            taskCommand.commands.clear(msg);
            break;
        case 'taskedit':
            taskCommand.commands.edit(msg, prefix, keyword);
            break;
        case 'taskcomplete':
            taskCommand.commands.markComplete(msg, prefix, keyword);
            break;
        case 'taskincomplete':
            taskCommand.commands.markIncomplete(msg, prefix, keyword);
            break;
        case 'howmanydays':
            miscCommand.commands.howManyDays(msg, prefix, keyword);
            break;
        default:
            break;
    }
}

module.exports = { UserCommand };