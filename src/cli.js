import arg from 'arg';
import inquirer from 'inquirer';
import {createComponent} from "./main";

function parseArgumentIntoOptions(rawArgs) {
    const args = arg(
        {
            '--test': Boolean,
            '--hooks': Boolean,
            '-t': '--test',
            '-h': '--hooks',
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return{
        componentName: args._[0],
    }
}

async function promptForMissingOptions(options) {
    const questions = [];

    if (!options.componentName) {
        questions.push({
            type: 'input',
            name: 'componentName',
            message: 'Please name the component',
        });
    }

    const answers = await inquirer.prompt(questions);
    return{
        ...options,
        componentName: options.componentName || answers.componentName
    };
}

export async function cli(args) {
    let options = parseArgumentIntoOptions(args);
    options = await promptForMissingOptions(options);
    await createComponent(options);
}
