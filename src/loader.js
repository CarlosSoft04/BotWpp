 
 const {TIMEOUT_IN_MILLISECONDS_BY_EVENT} = require("./config")

 exports.load = (socket) => {
    socket.ev.on("message.upsert", ({message})=>{
        setTimeout(() =>{
            onMessagesUpsert({socket, messages});
        }, TIMEOUT_IN_MILLISECONDS_BY_EVENT);
    });
 }