const { PREFIX, BOT_NUMBER } = require("../../config");
const {DangerError, InvalidParameterError} = require("../../errors")
const {onlyNumbers, toUserJid} = require("../../utils")

module.exports = {
    name : 'banir',
    description : 'Removo um membro do grupo',
    commands: ["ban", "kick"],
    usage: `${PREFIX}ban @marcar_membro
    
    
    ou 
    
    
    ${PREFIX} ban (mencionando uma mensagem)`,
    handle: async ({
        args,
        isReply,
        socket,
        remoteJid,
        replyJid,
        sendSuccessReply,
        userJid,
        
    }) => {
        if(!args.length && !isReply) {
            throw  new InvalidParameterError("Voce precisa mecionar um membro"

            );
        }


        const memberToRemoveNumber = onlyNumbers(args[0]);
        const memberToRemoveJid = isReply 
        ? replyJid
         : toUserJid(memberToRemoveNumber);

         if(memberToRemoveNumber.length < 7 || memberToRemoveNumber.length > 15) {
            throw new InvalidParameterError("Numero invalido!!");
         }

         if(memberToRemoveJid === userJid) {
            throw new DangerError("Vocenao remove voce mesmo")
         }

         const botJid = toUserJid(BOT_NUMBER);

         if(memberToRemoveJid == botJid) {
            throw new DangerError("Voce nao pode me remover!!")
         }
         await socket.groupParticipantsUpdate(remoteJid, [memberToRemoveJid], "remove"

         );

         await sendSuccessReply("Membro removido com sucesso")
    },
};