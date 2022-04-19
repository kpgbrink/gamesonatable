
import { promises as fs } from 'fs';

let generatedString = "";

(async () => {
    generatedString += `export const avatarImages = {\n`;
    let folders = await fs.readdir('../client/public/assets/player');
    for (let folder of folders) {
        generatedString += `    ${folder}: [\n`;
        let files = await fs.readdir(`../client/public/assets/player/${folder}`);
        for (let file of files) {
            let fileName = file.split('.')[0];
            generatedString += `        '${file}',\n`;
        }
        generatedString += `    ],\n`;
    }
    generatedString += `}\n`;
    generatedString = generatedString.slice(0, -1);
    console.log(generatedString);
    await fs.writeFile('../client/src/PhaserPages/objects/avatarImages.generated.ts', generatedString);
})();


