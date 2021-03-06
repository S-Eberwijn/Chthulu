const fs = require("fs");
const { GeneralInfo } = require('../../database/models/GeneralInfo');
const { logger } = require(`../../functions/logger`)


module.exports = async bot => {
    // Check to see if bot is ready
    logger.info(`${bot.user.username} bot is online!`);

    // Set activity status of the bot
    bot.user.setActivity(`Khthonios`, { type: "LISTENING" });

    // const JUST_A_CHANNEL = bot.guilds.cache.get('532525442201026580').channels.cache.find(c => c.id === '634844140500418570' && c.type == "text");
    // JUST_A_CHANNEL.send('Bot is online');

    //Initialize databases
    

    //Update resurrection database
    // bot.ressurection['resurrections'] = {
    //     count: bot.ressurection['resurrections'].count + 1
    // };
    // fs.writeFile("./bot/jsonDb/ressurection.json", JSON.stringify(bot.ressurection, null, 4), err => {
    //     if (err) throw err;
    // });


    //setting slash command for all guilds
    //todo change to for loop
    bot.guilds.cache.forEach(async guild => {
        await GeneralInfo.findOne({ where: { id: guild.id } }).then(async server => {
            try {
                if (server) await bot.guilds.cache.get(guild.id)?.commands.set(bot.slashCommands.filter(cmd => !server?.disabled_commands?.includes(cmd.help.name)).map(cmd => cmd.help))
            } catch (error) {
                logger.error(error)
            }
        });
    })

}
 

