const { addCreatedDate } = require('../../functions/api/misc');
const { getServerMap, getAllMaps } = require('../../functions/api/maps');
const { getServerDisabledCommands, editServerCommands } = require('../../functions/api/guild');
const { getAliveCharacters, getNonPlayableCharacters } = require('../../functions/api/characters');
const { getServerQuestsByStatuses, getQuestsByStatuses, createQuest, deleteQuest, updateQuest } = require('../../functions/api/quests');
const { getBotCommandsByCategory } = require('../../functions/api/bot');
const { approveGameSession, declineGameSession, joinGameSession, getAllGameSessions, getAllServerGameSessions } = require('../../functions/api/sessions');

const { editAllGameSessionsForWebsite } = require('../../functions/website');

exports.dashboardPage = async (req, res) => {
    res.render('dashboardPage', {
        ...res.locals.renderData,
        ...{
            isDashboardPage: true,
            headerTitle: 'Chthulu',
            characters: await getAliveCharacters(),
            allQuests: await getQuestsByStatuses(["OPEN", "DONE", "EXPIRED", "FAILED"]),
            sessions: await getAllGameSessions(),
            locations: await getAllMaps(),
        }
    });
}

exports.guildDashboardPage = async (req, res) => {
    res.render('dashboardPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: '',
            characters: await getAliveCharacters(res.locals.renderData?.selectedGuildId),
            allQuests: await getServerQuestsByStatuses(res.locals.renderData?.selectedGuildId, ["OPEN", "DONE", "EXPIRED", "FAILED"]),
            sessions: await getAllServerGameSessions(res.locals.renderData?.selectedGuildId),
            locations: await getServerMap(res.locals.renderData?.selectedGuildId),
        }
    });
}

//CONSTRUCTION PAGE
exports.constructionDashboardPage = async (req, res) => {
    res.render('constructionPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: '',
        }
    });
}

//CHARACTERS PAGE
exports.guildInformationalCharactersDashboardPage = async (req, res) => {
    res.render('charactersPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Characters`,
            characters: (await getAliveCharacters(res.locals.renderData?.selectedGuildId)).reverse(),
        }
    });
}

//NPC'S PAGE
exports.guildInformationalNonPlayableCharactersDashboardPage = async (req, res) => {
    res.render('nonPlayableCharactersPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `NPC's`,
            npcs: (await getNonPlayableCharacters(res.locals.renderData?.selectedGuildId)).reverse(),
        }
    });
}

//QUESTS PAGE
exports.guildInformationalQuestsDashboardPage = async (req, res) => {
    res.render('questsPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Quests`,
            uncompletedQuests: (await addCreatedDate((await getServerQuestsByStatuses(res.locals.renderData?.selectedGuildId, ["OPEN"])))).reverse(),
            completedQuests: (await getServerQuestsByStatuses(res.locals.renderData?.selectedGuildId, ["DONE", "EXPIRED", "FAILED"])).reverse(),
        }
    });
}

//CREATE QUEST POST
exports.createQuestPost = async (req, res) => {
    // TODO add validator on backend level
    createQuest(req.body, res.locals.renderData?.selectedGuildId, req.user?.discordID).then((quest) => { res.json(quest); }).catch(() => { res.sendStatus(401) });
}

exports.deleteQuestRequest = async (req, res) => {
    await deleteQuest(req.body?.quest_id, req.params?.id).then(() => { return res.sendStatus(201) }).catch(() => { return res.sendStatus(400) });
}

//TODO: Add validation with express validation
exports.editQuestRequest = async (req, res) => {
    await updateQuest(req.body, req.params?.id).then(() => { return res.sendStatus(201) }).catch(() => { return res.sendStatus(400) });
}

exports.guildInformationalMapDashboardPage = async (req, res) => {
    res.render('mapPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Map`,
            databaseMap: await getServerMap(res.locals.renderData?.selectedGuildId),
        }
    });
}

//Sessions Page
exports.sessionsPage = async (req, res) => {
    res.render('sessionsPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Sessions`,
            sessions: await editAllGameSessionsForWebsite(await getAllServerGameSessions(res.locals.renderData?.selectedGuildId)),
        }
    });
}

//TODO: Add validation with express validation
exports.approveGameSession = async (req, res) => {
    await approveGameSession(req.body, req.params?.id, req.user?.discordID).then(message => { return res.json(message); }).catch(() => { return res.sendStatus(400) });
}

//TODO: Add validation with express validation
exports.declineGameSession = async (req, res) => {
    await declineGameSession(req.body, req.params?.id, req.user?.discordID).then(message => { return res.json(message); }).catch(() => { return res.sendStatus(400) });
}

exports.joinGameSession = async (req, res) => {
    await joinGameSession(req.body, req.params?.id, req.user?.discordID).then(message => { return res.json(message); }).catch((err) => { return res.status(400).json(err); });
}

//SETTINGS PAGE
exports.guildSettingsPage = async (req, res) => {
    res.render('settingsPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Settings`,
            commands: getBotCommandsByCategory(req.url.split('/')[req.url.split('/').length - 1]),
            disabled_commands: await getServerDisabledCommands(res.locals.renderData?.selectedGuildId),
        }
    });
}

exports.editSettingsRequest = async (req, res) => {
    editServerCommands(res.locals.renderData?.selectedGuildId, req.body).then(() => { return res.sendStatus(201) }).catch(() => { return res.sendStatus(400) });
}