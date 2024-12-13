const { PREFIX } = require("../../config");

module.exports = {
    name : 'ping',
    description : 'Verificar se o bot esta online',
    commands: ["ping"],
    usage: `${PREFIX}ping`,
    handle: async ({sendReply, sendReact}) => {
        await sendReact("🏓");
        await sendReply("🏓 Pong!")

    },
};