const { PREFIX } = require("../../config");

module.exports = {
    name : 'comando',
    description : 'Descricao do comando',
    commands: ['comando1', 'comando2'],
    usage: `${PREFIX} comando`,
    handle: async ({}) => {

    },
};