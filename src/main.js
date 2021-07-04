import chalk from 'chalk';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { promisify } from 'util';

const access = promisify(fs.access);

async function copyTemplate(options) {
    // Make component Directory
    fs.mkdirSync(options.componentName, {recursive: true});

    // Copy template + Filters
    fse.copySync(options.templateDirectory, `${options.targetDirectory}/${options.componentName}`, {
        overwrite: true,
        filter: path => {
            console.log('path ===', path)
            return (options._tests ? !(path.indexOf('__tests__') > -1) : -1) && (options.hooks ? !(path.indexOf('hooks') > -1) : -1)
        }
        });

    // Rename files
    const files = fs.readdirSync(options.componentName);
    files.forEach(file => {
        fs.renameSync(
            options.componentName + `/${file}`,
            options.componentName + `/${file.replace('componentName', options.componentName)}`,
            err => console.log(err)
        )
        console.log(options.componentName + `/${file.replace('componentName', options.componentName)}`)
    });
}

export async function createComponent(options) {
    options = {
        ...options,
        targetDirectory: process.cwd(),
    };

    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../templates',
        'component'
    );
    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    console.log('Copy project files');
    await copyTemplate(options);

    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}


// import chalk from 'chalk';
// import fs from 'fs';
//
// export async function createComponent(options) {
//     options = {
//         ...options,
//         targetDirectory: options.targetDirectory || process.cwd(),
//     };
//
//     //Component name
//     const componentName = options.componentName.toLowerCase();
//     fs.mkdir(`${componentName}`,(err) => {
//         if (err) throw err;
//         console.log('Folder created!');
//     });
//     fs.appendFile(`${componentName}` + "/" + `${componentName}`+".tsx", 'import styled from "styled-components";',(err) => {
//         if (err) throw err;
//         console.log('Saved!');
//     });
//
//     console.log('%s Project ready', chalk.blue.bold('DONE'));
//     return true;
// }
