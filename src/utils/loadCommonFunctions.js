const { extractDataFromMessage, baileysIs } = require(".");
const { BOT_EMOJI } = require("../config");
const  fs  = require('fs')
const {waitMessage} = require("../utils/messages")



exports.loadCommonFunctions = ({socket, webMessage}) => {
    const {remoteJid, prefix, commandName, args, userJid, isReply, replyJid}
     = extractDataFromMessage(webMessage);

     const isImage = baileysIs(webMessage, "image")
     const isVideo = baileysIs(webMessage, "video")
     const isSticker = baileysIs(webMessage, "sticker")




    const downloadImage = async (webMessage, fileName) => {
        return await download(webMessage, fileNme, "image", "png")
    };

    const downloadSticker = async (webMessage, fileName) => {
        return await download(webMessage, fileNme, "sticker", "webp")
    };
    const downloadVideo = async (webMessage, fileName) => {
        return await download(webMessage, fileNme, "video", "mp4")
    }

    const sendText = async (text) => {
        return await socket.sendMessage(remoteJid, {text: `${BOT_EMOJI} ${text}`})
    };


    const sendReply = async (text) => {
        return await socket.sendMessage(
            remoteJid, {text: `${BOT_EMOJI} ${text}`},
            {quoted: webMessage}
        )
    }

    const sendReact = async (emoji) => {
        return await socket.sendMessage(remoteJid, {
            react: {
                text: emoji,
                key: webMessage.key,
            }
        })
    }

    const sendSuccessReact = async () => {
        return await sendReact("✅");
    };

    const sendWaitReact = async () => {
        return await sendReact("⏳");
    }

    const sendWarningReact = async () => {
        return await sendReact("⚠️");
    }

    const sendErrorReact = async () => {
        return await sendReact("❌");
    };




    const sendSuccessReply = async (text) => {
        await sendSuccessReact();
        return await sendReply(`✅ Sucesso  ${text}`);

    };

    const sendWaitReply = async (text) => {
        await sendWaitReact();
        return await sendReply(`⏳Aguarde... ${text || waitMessage}`);

    };

    const sendWarningReply = async (text) => {
        await sendWarningReact();
        return await sendReply(`⚠️Atencao  ${text}`);

    };

    const sendErrorReply = async (text) => {
        await sendErrorReact();
        return await sendReply(`❌ Erro  ${text}`);

    };

    const sendStickerFromFile = async (file) => {
       return  await socket.sendMessage(remoteJid, {
        sticker: fs.readFileSync(file),
       });
    };

    const sendImageFromFile = async (file) => {
        return await socket.sendMessage(remoteJid, {
            image: fs.readFileSync(file),
        });
    };


    return {
        socket,
        remoteJid,
        userJid,
        prefix,
        commandName,
        args,
        isReply,
        isImage,
        isVideo,
        isSticker,
        replyJid,
        webMessage,
        sendText,
        sendReply,
        sendStickerFromFile,
        sendImageFromFile,
        sendReact,
        sendSuccessReact,
        sendErrorReact,
        sendWaitReact,
        sendWarningReact,
        sendSuccessReply,
        sendWaitReply,
        sendWarningReply,
        sendErrorReply,
        downloadImage,
        downloadSticker,
        downloadVideo,
    };
    
};