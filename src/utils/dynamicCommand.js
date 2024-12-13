const { verifyPrefix, hasTypeOrCommand } = require("../midlewares");
const { checkPermissiion } = require("../midlewares/checkPermission");

const {
  DangerError,
  WarningError,
  InvalidParameterError,
} = require("../errors");

const {findCommandImport} = require(".");

exports.dynamicCommand = async (paramsHandler) => {
  const { commandName, prefix, sendWarningReply, sendErrorReply } =
    paramsHandler;

  const { type, command } = findCommandImport(commandName);

  if (!verifyPrefix(prefix) || !hasTypeOrCommand({ type, command })) {
    return;
  }

  if (!(await checkPermissiion({ type, ...paramsHandler }))) {
    return sendErrorReply(
      "Voce nao tem permissao para acessar para executar este comando"
    );
  }

  try {
    await command.handle({ ...paramsHandler, type });
  } catch (error) {
    

    if (error instanceof InvalidParameterError) {
      await sendWarningReply(`Parametros invalidos! ${error.message}`);
    } else if (error instanceof WarningError) {
      await sendWarningReply(error.message);
    } else if (error instanceof DangerError) {
      await sendErrorReply(error.message);
    } else {
      console.log(error);
      await sendErrorReply(`Ocorreu um erro ao executar o comando ${command.name}! O dev foi notificado
📋 *Detalhes*: ${error.message} `);
    };
  };
};
