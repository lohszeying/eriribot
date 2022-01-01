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
            taskCommand.taskList.add(msg, prefix, keyword);
            break;
        case 'taskl':
            taskCommand.taskList.list(msg);
            break;
        case 'taskdel':
            taskCommand.taskList.delete(msg, prefix, keyword);
            break;
        case 'taskclear':
            taskCommand.taskList.clear(msg);
            break;
        case 'taskedit':
            taskCommand.taskList.edit (msg, prefix, keyword);
            break;
        case 'howmanydays':
            miscCommand.commands.howManyDays(msg, prefix, keyword);
            break;
        default:
            break;
    }
}

module.exports = { UserCommand };