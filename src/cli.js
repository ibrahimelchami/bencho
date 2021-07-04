import arg from 'arg';
import inquirer from 'inquirer';
import {createComponent} from "./main";

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--tests': Boolean,
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
        _test: args['--tests'] || false,
        hooks: args['--hooks'] || false
    }
}

async function promptForMissingOptions(options) {
    const questions = [];
    if (!options.componentName) {
        questions.push({
            type: 'input',
            name: 'componentName',
            message: 'Name of your component:',
        });
    }

    if (!options._tests) {
        questions.push({
            type: 'confirm',
            name: '_test',
            message: 'Add tests?',
            default: false,
        });
    }

    if (!options.hooks) {
        questions.push({
            type: 'confirm',
            name: 'hooks',
            message: 'Add hooks?',
            default: false,
        });
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        componentName: options.componentName || answers.componentName,
        _tests: options._tests || !answers._tests,
        hooks: options.hooks || !answers.hooks,
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await createComponent(options);
}


// import arg from 'arg';
// import inquirer from 'inquirer';
// import {createComponent} from "./main";
//
// function parseArgumentIntoOptions(rawArgs) {
//     const args = arg(
//         {
//             '--test': Boolean,
//             '--hooks': Boolean,
//             '-t': '--test',
//             '-h': '--hooks',
//         },
//         {
//             argv: rawArgs.slice(2),
//         }
//     );
//     return{
//         componentName: args._[0],
//     }
// }
//
// async function promptForMissingOptions(options) {
//     const questions = [];
//
//     if (!options.componentName) {
//         questions.push({
//             type: 'input',
//             name: 'componentName',
//             message: 'Please name the component',
//         });
//     }
//
//     const answers = await inquirer.prompt(questions);
//     return{
//         ...options,
//         componentName: options.componentName || answers.componentName
//     };
// }
//
// export async function cli(args) {
//     let options = parseArgumentIntoOptions(args);
//     options = await promptForMissingOptions(options);
//     await createComponent(options);
// }
