const PlayerCharacter = require('../../../database/models/PlayerCharacter');
const { getCharacterEmbed, getCharacterLevelImage } = require('../../otherFunctions/characterEmbed')

module.exports.run = async (interaction) => {
    //Returns the character of the message author or the mentioned user
    const user = interaction.options.getUser('user')|| interaction.user;
    //Searches the database for a valid character
    let character = await PlayerCharacter.findOne({ where: { player_id: user.id, alive: 1, server_id: interaction.guild.id } })
    //If no character is linked to the user, return an error message
    if (!character) return interaction.reply({ content: 'This user does not have a character!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));

    await interaction.reply({ embeds: [await getCharacterEmbed(character)], files: [await getCharacterLevelImage(character)] });
}

module.exports.help = {
    name: 'character',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}