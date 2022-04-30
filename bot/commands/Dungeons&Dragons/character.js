const { PlayerCharacter } = require('../../../database/models/PlayerCharacter');
const { logger } = require(`../../../functions/logger`)

const { getCharacterEmbed, getCharacterLevelImage, getCharacterPicture } = require('../../otherFunctions/characterEmbed')
const { sendCharacterEmbedMessageFromInteraction, sendCharacterEmbedMessageInChannel } = require('../../otherFunctions/characterEmbed');

module.exports.run = async (interaction) => {
    await interaction.deferReply()
    //Returns the character of the message author or the mentioned user
    const user = interaction.options.getUser('user') || interaction.user;
    //Searches the database for a valid character
    let character = await PlayerCharacter.findOne({ where: { player_id_discord: user.id, alive: 1, server: interaction.guild.id } })
    logger.debug(`${interaction.user.username}(${interaction.user.id}) is requesting a character${interaction.options.getUser('user') ? ` from ${user.username}(${user.id})` : ``}. Result: ${character?.name ? character.name : 'No character found'}`)
    //If no character is linked to the user, return an error message
    if (!character) return interaction.editReply({ content: 'This user does not have a character!', ephemeral: true })
    // await interaction.deferReply({ content: 'Test'})
    await sendCharacterEmbedMessageFromInteraction(interaction, character, null, null);
    // await interaction.reply({ embeds: [await getCharacterEmbed(character)], files: [  await getCharacterLevelImage(character), await getCharacterPicture(character)] });
}

module.exports.help = {
    // name: 'character',
    // permission: [],
    // alias: [],
    category: "Dungeons & Dragons",
    name: 'character',
    description: 'Show an user character.',
    options: [{
        name: 'user',
        type: 'USER',
        description: 'User to look character',
        required: false
    }],
}