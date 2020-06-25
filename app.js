const {Client} = require("discord.js");
const {logginCredentials} = require("./src/discord/ready")
const {createHelp} = require('./src/helper/discord');
const {createEmbedMessage, sendMessage, sendEmbedMessage} = require('./src/discord/message');
const {playListSystem} = require('./src/playlist/playlist');
const {experienceSystem} = require('./src/experience/experience');
const {leadboardSystem} = require('./src/leaderboards/leadboard')
const {sendErrorConsole} = require('./src/helper/utils');
const config = require('./config.json');

const prefix = config.discord.prefix;
const client = new Client();

client.login(process.env.BOT_TOKEN).then();

client.on("ready", () => {
    logginCredentials(client);
});

client.on("message", (message) => {
    let fields;
    try {
        if (message.author.equals(client.user)) return;
        if (!message.content.startsWith(prefix)) return;
        let args = message.content.substring(prefix.length).split(' ');
        let command = args[0].toLowerCase();
        if (command === 'play' || command === 'skip' || command === 'stop' || command === 'pause' || command === 'resume' || command === 'volumen'
            || command === 'shuffle' || command === 'playlist') {
            playListSystem(command, message, args);
        }else if(command === 'registrar' || command === 'recompensa' || command === 'cuenta' || command === 'tabla'){
            leadboardSystem(command, message, args);
        }else if(command === 'ayuda'){
            fields = createHelp();
            sendEmbedMessage(createEmbedMessage('Ayuda', fields, 'https://image.flaticon.com/icons/png/512/682/682055.png', undefined), message);
        }else{
            sendMessage('no existe ese comando. Usa el comando `-ayuda` para ver todos los que están disponibles.', message).then();
        }
    } catch (err) {
        sendMessage('ocurrió un error', message).then();
        sendErrorConsole(err);
    }
});