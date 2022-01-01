const taskCommand = require('./Command/Task/taskCommand');
const miscCommand = require('./Command/Misc/miscCommand');
const calCommand = require('./Command/PrimogemsCalculator/primogemsCalculatorCommand');

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
        case 'helpgems':
            calCommand.commands.help(msg, prefix, keyword);
            break;
        case 'gemsaddcategory':
            calCommand.commands.addCategory(msg, prefix, keyword);
            break;
        case 'gemscategory':
            calCommand.commands.getCategory(msg, prefix, keyword);
            break;
        case 'gemseditcategory':
            calCommand.commands.editCategory(msg, prefix, keyword);
            break;
        case 'gemsdeletecategory':
            calCommand.commands.deleteCategory(msg, prefix, keyword);
            break;
        case 'gemsclearcategory':
            calCommand.commands.clearCategory(msg, prefix, keyword);
            break;
        case 'gemsaddcalculation':
            calCommand.commands.addCalculation(msg, prefix, keyword);
            break;
        case 'gemseditcalculation':
            calCommand.commands.editCalculation(msg, prefix, keyword);
            break;
        case 'gemsdeletecalculation':
            calCommand.commands.deleteCalculation(msg, prefix, keyword);
            break;
        case 'gemsclearcalculation':
            calCommand.commands.clearCalculation(msg, prefix, keyword);
            break;
        case 'gemscalculate':
            calCommand.commands.calculateCategory(msg, prefix, keyword);
            break;
        case 'gemslist':
            calCommand.commands.getGemsList(msg, prefix, keyword);
            break;
        case 'gemscopy':
            calCommand.commands.copyCategory(msg, prefix, keyword);
            break;
        default:
            break;
    }
}

module.exports = { UserCommand };