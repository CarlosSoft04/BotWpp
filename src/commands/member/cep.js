const { PREFIX } = require("../../config");
const { consultarCep } = require("correios-brasil");

module.exports = {
  name: "cep",
  description: "Consulta do CEP",
  commands: ["dep"],
  usage: `${PREFIX}cep 01001-001`,
  handle: async ({ args, sendWarningReply, sendSuccessReply }) => {

    const cepSearch = args[0];

    if (!cepSearch || ![8, 9].includes(cepSearch.length)) {
      return sendWarningReply(
        "Voce precisa enviar um CEP no formato 00000-000 ou 00000000!"
      );
    }

    try {
      const data = await consultarCep(cepSearch);
      

      if (!data.cep) {
        await sendWarningReply("Cep nao encontrado");
        return;
      }

      const { cep, logradouro, complemento, bairro, localidade, uf, ibge } =
        data;

      await sendSuccessReply(`*Resultdos*
                *CEP:* ${data.cep}
                *Logradouro:* ${data.logradouro}
                *Complemento:*${data.bairro}
                *Localidade:*${data.localidade}
                *UF:*${data.uf}
                *IBGE:*${data.ibge}`);
    } catch (error) {
      throw new Error(error);
    }
  },
};
