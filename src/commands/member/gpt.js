const { PREFIX } = require("../../config");
const {gpt}  = require('../../services/gpt')

module.exports = {
    name : 'gpt',
    description : 'Comando de inteligencia artificial',
    commands: ["gpt" , "skybot"],
    usage: `${PREFIX}gpt com quantos paus se faz ma canoa?`,
    handle: async ({sendSuccessReply, sendErrorReply, sendWaitReply, args}) => {
      const text = args[0];

      if(!text) {
        await sendErrorReply("Voce precisa enviar um texto");
        return;
      }

      await sendWaitReply();

      const responseText = await getPlatformId(text);

      await sendSuccessReply(responseText);
        
        

    },  
};