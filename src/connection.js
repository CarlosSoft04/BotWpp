

const {
  default: makeWSocket, //Cria um WebSocket que se conecta ao servidor do whatsapp
  useMultiFileAuthState, //Lida com a autenticacao e gerencia arquivos para armazenar credenciais
  fetchLatestBaileysVersion, //obtem a versao mais recente suportada do wpp
  DisconnectReason, //Enum com razoes provaveis para desconexao
} = require("@whiskeysockets/baileys"); 

const path = require("path"); //Facilitar a manipulacao de caminhos de arquivos
const pino = require("pino"); //Biblioteca para lidar com loggers 
 
const { question, onlyNumbers } = require("./utils"); // question exibe uma pergunta e retorna entrada do usuario
//onlyNumbers remove caratcters quando for perguntar o numero do usuario


//Funcao que conecta ao whatsapp e gerencia eventos como autenticacao, 
//reconexao e atualizacoes de credenciaas
exports.connect = async () => { //Criando uma funcao assincrona
  const { state, saveCreds } = await useMultiFileAuthState( // state tem as credencias do robo e saveCreds é uma funcao para salvar as credenciais
    path.resolve(__dirname, "..", "assets", "auth", "baileys") 
  ); 


  // Configurando o websocket para que suporte a versao mais atualizada do whatsapp.
  const { version } = await fetchLatestBaileysVersion();
  const socket = makeWSocket({ //makeWSocket configura o websocket
    printQRInTerminal: false, //Desabilita e exibicao do QR Code no terminal
    version,
    logger: pino({ level: "error" }), //Configura o nivel do log como error
    auth: state, // Usa o estado de autenticacao gerado anteriormente
    browser: ["Chrome (Linux)", "", ""], //Simula um navegador espcifico
    markOnlineOnConnect: true, //Marca o estado do bot como online
  });


  // Verifica se as credenciais estão registradas
  if (!socket.authState?.creds.registered) {
    const phoneNumber = await question("Informe o seu numero de telefone: "); //question solicita o usuario no numero de telefone

    if (!phoneNumber) {
      throw new Error("Numero invalido");
    }

    const code =await socket.requestPairingCode(onlyNumbers(phoneNumber));

    console.log(`Codigo de pareamento: ${code}`);
  }



  // Evento de atualização de conexão
  socket.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
 //Verifica se a conexao foi encerreada e se ela foi devido ao logout a funcao connect é chamada para tentar reconectar
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        exports.connect(); // Substituído `this.connect` por `exports.connect`
      }
    }
  });

  // Atualiza credenciais no evento de atualização
  socket.ev.on("creds.update", saveCreds);

  return socket;
};
