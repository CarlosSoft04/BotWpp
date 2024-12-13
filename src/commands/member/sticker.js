const { PREFIX, TEMP_DIR } = require("../../config");
const { InvalidParameterError } = require("../../errors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path")

module.exports = {
  name: "sticker",
  description: "Faco figurinhas de imagem/gif e video",
  commands: ["s", "sticker", "fig", "f"],
  usage: `${PREFIX}sticker (marque a imagem/gif/video) ou ${PREFIX} (responda a imagem/gif/video) ou ${PREFIX} `,
  handle: async ({
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    sendErrorReply,
    sendSuccessReact,
    sendStickerFromFile,
  }) => {
    if (!isImage && !isVideo) {
      throw new InvalidParameterError(
        "Voce precisa marcar uma imagem/gif/video ou respinder a uma imagem/gif/video"
      );
    }

    const outputPath = path.resolve(TEMP_DIR, "output.webp");

    if (isImage) {
      const inputPath = await downloadImage(webMessage, "input");
      exec(
        `ffmpeg -i ${inputPath} -vf scale=512:512 ${outputPath}`,
        async (error) => {
          if (error) {
            console.log(error);
            fs.unlinkSync(inputPath);
            throw new Error(error);
          }
          await sendSuccessReact();

          await sendStickerFromFile(outputPath);

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        }
      );
    } else {
        const inputPath = await downloadVideo(webMessage, "input");

        const sizeInSeconds = 10;

        const seconds = 
        webMessage.message?.videoMessage?.seconds ||
        webMessage.message?.extendedTextMessage?.contextInfo?.qutedMessage
        ?.videoMessage?.seconds;

        const haveSecondsRule = seconds <= sizeInSeconds;

        if(!haveSecondsRule) {
            fs.unlinkSync(inputPath);
            await sendErrorReply(`O video que enviou tem mais de ${sizeInSeconds} segundos!
                Envie um video menor!!`);

                return;
        }
        exec(`
            ffmpeg -i ${inputPath} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512, fps=12, pad=512:512:-1:color=white@0.0, split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]palettuse" -f webp ${outputPath},
            `, async (error) => {
                if(error) {
                    console.log(error);
                    fs.unlinkSync(inputPath);
                    throw new Error(error);
                }

                await sendSuccessReact();
                await sendStickerFromFile(outputPath);

                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            })
    }
  },
};
