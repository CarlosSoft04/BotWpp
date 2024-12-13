const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const readline = require("readline");
const path = require("path");
const { writeFile } = require("fs/promises");
const { TEMP_DIR, COMMAND_DIR, PREFIX } = require("../config");
const fs = require("fs");
const { type } = require("os");

exports.question = (message) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(message, resolve));
};

const onlyNumbers = (text) => text.replace(/[^0-9]/g,"");

exports.onlyNumbers = onlyNumbers;

exports.toUserJid = (number) => `${onlyNumbers(number)}@s.whatsapp.net`

//Essa funcao eh responsavel por receber mensagens, extrair informacoes e enviar para outras partes do sistema
exports.extractDataFromMessage = (webMessage) => {
  //Verifica cada membro da mensagem do texto principal
  const textMessage = webMessage.message?.conversation;
  const extendedTextMessage = webMessage.message?.extendedTextMessage;
  const extendedTextMessageText = extendedTextMessage?.text;
  const imageTextMessage = webMessage.message?.imageMessage?.caption;
  const videoTextMessage = webMessage.message?.videoMessage?.caption;

  //Junta tudo em uma unica variavel, que eh o fullMessage
  const fullMessage =
    textMessage ||
    extendedTextMessageText ||
    imageTextMessage ||
    videoTextMessage;

  //Retorna um array vazio para mensagens om texto vazio
  if (!fullMessage) {
    return {
      remoteJid: null,
      userJid: null,
      prefix: null,
      commandName: null,
      isReply: null,
      replyJid: null,
      args: [],
    };
  }

  //Identificacao de respostas, verifica se uma mensagem é citada
  const isReply =
    !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;

  const replyJid =
    !!extendedTextMessage && !!extendedTextMessage.contextInfo?.participant
      ? extendedTextMessage.contextInfo.participant
      : null;

  //Extrai o identificador do usuario e retira caracteres desnecessarios
  const userJid = webMessage?.key?.participant?.replace(
    /:[0-9] [0-9] | : [0-9]/g,
    ""
  );

  //Separa o comando do resto da mensagem
  const [command, ...args] = fullMessage.split(" ");
  const prefix = command.charAt(0);

  const commandWithoutPrefix = command.replace(
    new RegExp(`^[${PREFIX}] +`),
    ""
  );

  //Essa funcao retorna um objeto contendo todos os parametros passados como:
  return {
    remoteJid: webMessage?.key?.remoteJid,
    prefix,
    userJid, //Id
    replyJid, //Id
    isReply, //Id
    commandName: this.formatCommand(commandWithoutPrefix),
    args: this.splitByCharacters(args.join(" "), ["\\", "|", "/"]),
  };
};

exports.splitByCharacters = (str, characters) => {
  characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
  const regex = new RegExp(`[${characters.join("")}]`);

  return str
    .split(regex)
    .map((str) => str.trim())
    .filter(Boolean);
};

exports.formatCommand = (text) => {
  return this.onlyLettersAndNumbers(
    this.removeAccentsAndSpecialCharacters(text.toLocaleLowerCase().trim())
  );
};

exports.removeAccentsAndSpecialCharacters = (text) => {
  if (!text) return "";

  return text.normalize("NFD").replace(/[\u0300-\u036F]/g, ""); // Letras maiúsculas são importantes
};

exports.baileysIs = (webMessage, context) => {
  return !!this.getContent(webMessage, context);
};

exports.getContent = (webMessage, context) => {
  return (
    webMessage.message?.[`${context}Message`] ||
    webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[
      `${context}Message`
    ]
  );
};

exports.download = async (webMessage, fileName, context, xtension) => {
  const content = this.getContent(webMessage, context);

  if (!content) {
    return null;
  }

  const stream = await downloadContentFromMessage(content, context);

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  const filePath = path.resolve(TEMP_DIR, `${fileName}.${extension}`);

  await writeFile(filePath, buffer);

  return filePath;
};

exports.findCommandImport = (commandName) => {
  const command = this.readCommandImports();

  let typeReturn = "";
  let targetCommandReturn = null;

  for (const [type, commands] of Object.entries(command)) {
    if (!commands.length) {
      continue;
    }

    const targetCommand = commands.find((cmd) =>
      cmd.commands.map((cmd) => this.formatCommand(cmd)).includes(commandName)
    );

    if (targetCommand) {
      typeReturn = type;
      targetCommandReturn = targetCommand;
      break;
    }
  }

  return {
    type: typeReturn,
    command: targetCommandReturn,
  };
};

exports.readCommandImports = () => {
  const subdirectors = fs
    .readdirSync(COMMAND_DIR, { withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .map((directory) => directory.name);

  const commandImports = {};

  for (const subdir of subdirectors) {
    const subdirectoryPath = path.join(COMMAND_DIR, subdir);
    const files = fs
      .readdirSync(subdirectoryPath)
      .filter(
        (file) =>
          !file.startsWith("_") &&
          (file.endsWith(".js") || file.endsWith(".ts"))
      )

      .map((file) => require(path.join(subdirectoryPath, file)));

    commandImports[subdir] = files;
  }

  return commandImports;
};
