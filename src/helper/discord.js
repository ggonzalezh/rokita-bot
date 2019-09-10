const { RichEmbed } = require('discord.js');
const config = require('../../config.json')

exports.createEmbedMessage = (author = undefined, fields = undefined, thumbNail = undefined, footer = undefined) => {
    let embed = new RichEmbed();

    if (undefined != author) {
        embed.setAuthor(author);
    }

    if (fields.length > 0 && undefined != fields) {
        for (const field of fields) {
            embed.addField(field.name, " " + field.value)
        }
    }

    if (undefined != thumbNail) {
        embed.setThumbnail(thumbNail);
    }

    if (undefined != footer) {
        embed.setFooter(footer.text, footer.icon);
    }
    embed.setColor(0x860202);

    return embed;
}


exports.createHelp = () => {
    let help = [{
        name: "Musica",
        value: "`!Play` `!Skip` `!Stop`"
    },
    {
        name: "Banco del Distrito Federal de Puno",
        value: "`!Chibolocoins`"
    },
    {
        name: "C L O W N S",
        value: "`!Peruano` `!Empresario` `!Elchileno` `!Tmr` `!Piel` `!Gachi`"
    },
    {
        name: "Misceláneo",
        value: "`!Cuenta` `!Profecia` `!10dif`"
    }]

    return help;
}