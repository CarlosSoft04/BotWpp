//Importando a funcao 'connect' da classe connection, criada.
const {connect} = require("./connection")

const {load} = require("./loader")
//É uma funcao assincrona usada para inicializar o processo principal
async function start () {
    //cria uma variavel para carregar a funcao
    const socket = await connect();

    //Carrega o socket de conexao
    load(socket);
    
}

start();