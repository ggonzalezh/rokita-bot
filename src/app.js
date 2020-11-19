import { Client, Collection } from 'discord.js';
import fs from 'fs';
import { start } from './discord/ready.js'
import { createEmbedMessage, sendMessage, sendEmbedMessage } from './discord/message.js'
import { createHelp } from './helper/discord.js'
import { playListSystem } from './playlist/playlist.js'
// import { leadboardSystem } from './src/leaderboards/leadboard.js'
// import { sendErrorConsole } from './src/helper/utils.js' */
/* const config = require('./config.json');*/
import config from './config/config.json'


const prefix = config.discord.prefix;
export const client = new Client();

client.command = new Collection();

client.login(process.env.BOT_TOKEN).then();

client.on("ready", () => start(client))

client.on("message", (message) => {
    /*     let fields;
        try {
            if (message.author.equals(client.user)) return;
            if (!message.content.startsWith(prefix)) return;
            let args = message.content.substring(prefix.length).split(' ');
            let command = args[0].toLowerCase();
            if (command === 'play' || command === 'skip' || command === 'stop' || command === 'pause' || command === 'resume' || command === 'volumen'
                || command === 'shuffle' || command === 'playlist') {
                playListSystem(command, message, args);
            } else if (command === 'registrar' || command === 'recompensa' || command === 'cuenta' || command === 'tabla') {
                leadboardSystem(command, message, args);
            } else if (command === 'ayuda') {
                fields = createHelp();
                sendEmbedMessage(createEmbedMessage('Ayuda', fields, 'https://image.flaticon.com/icons/png/512/682/682055.png', undefined), message);
            } else {
                sendMessage('no existe ese comando. Usa el comando `-ayuda` para ver todos los que están disponibles.', message).then();
            }
        } catch (err) {
            sendMessage('ocurrió un error', message).then();
            sendErrorConsole(err);
        } */
});