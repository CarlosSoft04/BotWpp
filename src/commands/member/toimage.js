const { PREFIX, TEMP_DIR } = require("../../config");
const fs = require("fs");
const {InvalidParameterError} = require("../../errors")
const path = require('path');
const { exec } = require("child_process");

module.exports = {
    name : 'toimage',
    description : 'Transformando figurinhas estaticas em imagem ',
    commands: ['toimage', 'toimg'],
    usage: `${PREFIX} toimage (marque a figurinha) ou ${PREFIX}toimage (responda a figuinha)`,

    handle: async ({
        isSticker,
        downloadSticker,
        webMessage,
        sendImageFromFile,
    }) => {
        if(!isSticker) {
            throw new InvalidParameterError("Voce precisa enviar uma figurinha");
        }

        const inputPath = await downloadSticker(webMessage, "input");
        const outputPath = path.resolve(TEMP_DIR, "output.png");

        exec(`ffmpeg -i ${inputPath} ${outputPath}`, async (error) => {
            if(error) {
                console.log(error);
                fs.unlinkSync(inputPath);
                throw new Error(error);
            }
            await sendImageFromFile(outputPath);

            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);

         
        })

    },
};