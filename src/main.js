import chalk from 'chalk';
import fs from 'fs';

export async function createComponent(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };

    //Component name
    const componentName = options.componentName.toLowerCase();
    fs.mkdir(`${componentName}`,(err) => {
        if (err) throw err;
        console.log('Folder created!');
    });
    fs.appendFile(`${componentName}` + "/" + `${componentName}`+".tsx", 'import styled from "styled-components";',(err) => {
        if (err) throw err;
        console.log('Saved!');
    });

    console.log('%s Project ready', chalk.blue.bold('DONE'));
    return true;
}
