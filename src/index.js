const {connect} = require("./connection")

const {load} = require("./loader")
//É uma funcao assincrona usada para inicializar o processo principal
async function start () {
    const socket = await connect();

    load(socket);
    
}

start();