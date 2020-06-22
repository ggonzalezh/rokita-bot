const {Client} = require("discord.js");
const {logginCredentials} = require("./src/discord/ready")
const {sayHello, addMemberToRole} = require("./src/discord/memberAdd");
const {getCoins, betCoins, dailyCoins} = require('./src/coin/coins');
const {newUserInGame} = require('./src/experience/experience');
const {betValidation} = require('./src/coin/helper/validation');
const {createHelp} = require('./src/helper/discord');
const {createEmbedMessage, sendMessage, sendEmbedMessage} = require('./src/discord/message');
const {play, skip, stop, shuffle, playlist, pause, resume, setVolumen, testPlaylist} = require('./src/playlist/playlist');
const {validationPlay, userInChannel} = require('./src/playlist/helper/validation');
const {sendErrorConsole} = require('./src/helper/utils');
const {searchItemInWiki} = require('./src/wiki/wiki');
const {elPeruano, elEmpresario, elChileno, laProfecia, elVici} = require('./src/memes/memes');
const config = require('./config.json');

const prefix = config.discord.prefix;
const client = new Client();

client.login(process.env.BOT_TOKEN).then();

client.on("ready", () => {
    logginCredentials(client);
});

client.on("guildMemberAdd", (member) => {
    sayHello(member);
    addMemberToRole(member);
});


client.on("message", (message) => {
    let fields;
    try {
        if (message.author.equals(client.user)) return;
        if (!message.content.startsWith(prefix)) return;
        let args = message.content.substring(prefix.length).split(' ');
        switch (args[0].toLowerCase()) {
            case "play":
                if (validationPlay(message, args)) {
                    play(message, args);
                }
                break;
            case "skip":
                if (userInChannel(message)) {
                    skip(message);
                }
                break;
            case "stop":
                if (userInChannel(message)) {
                    stop(message);
                }
                break;
            case 'pause':
                if(userInChannel(message)){
                    pause(message);
                }
                break;
            case 'resume':
                if(userInChannel(message)){
                    resume(message);
                }
                break;
            /*case 'volumen':
                if(userInChannel(message)){
                    setVolumen(message, args[1]);
                }
                break;*/
            case "shuffle":
                if (userInChannel(message)) {
                    shuffle(message);
                }
                break;
            case "playlist":
                if (userInChannel(message)) {
                    playlist(message);
                }
                break;
            case "coins":
                getCoins(message);
                break;
            case "daily":
                dailyCoins(message);
                break;
            case "bet":
                if (betValidation(message, args)) {
                    betCoins(message, args);
                }
                break;
            /*case "wiki":
                searchItemInWiki(message, args);
                break;*/
            case "leaderboards":
                sendMessage("comando en construcción", message).then();
                break;
            case "elperuano":
                elPeruano(message);
                break;
            case "elempresario":
                elEmpresario(message);
                break;
            case "elchileno":
                elChileno(message);
                break;
            case "profecia":
                laProfecia(message);
                break;
            case "vici":
                elVici(message);
                break;
            case "ayuda":
                fields = createHelp();
                sendEmbedMessage(createEmbedMessage('Ayuda', fields, 'https://image.flaticon.com/icons/png/512/682/682055.png', undefined), message);
                break;
            default:
                sendMessage('no existe ese comando. Usa el comando `-ayuda` para ver todos los que están disponibles.', message).then();
        }
    } catch (err) {
        sendMessage('ocurrió un error', message).then();
        sendErrorConsole(err);
    }
});