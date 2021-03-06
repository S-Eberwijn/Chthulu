const { defineModel } = require("firestore-sequelizer");
const Player = defineModel("players", {
    id: {
        type: 'string',
        required: true,
    },
    player_id_discord: {
        type: 'string',
        required: false
    },
    player_name: {
        type: 'string',
        required: false
    },
    server: {
        type: 'string',
        required: false,
    }
});

module.exports = { Player };