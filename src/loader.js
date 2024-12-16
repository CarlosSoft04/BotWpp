 
/**
 * Define a funcao que carrega a configuracao do sokcet e escuta eventos de mensagens.
 * Quando um evento de mensagens é disparado, ele executa um atraso pre definido ante de chamar a funcao para processar a mensagem
 */ 
 const {TIMEOUT_IN_MILLISECONDS_BY_EVENT} = require("./config")

 exports.load = (socket) => {
    //Escuta o evneot message.upsert que ocorre quando uma mensagem é inserida ou atualizada
    socket.ev.on("message.upsert", ({message})=>{
        //define um atraso para enviar a mensagem
        setTimeout(() =>{
            //Chama a funcao de processamento de mensagens
            onMessagesUpsert({socket, messages});
        }, TIMEOUT_IN_MILLISECONDS_BY_EVENT);
    });
 }