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
        value: "`!play` `!playlist` `!skip` `!stop`"
    },
    {
        name: "Banco del Distrito Federal de Puno",
        value: "`!coins`"
    },
    {
        name: "Casino de Juliaca",
        value: "`!bet`"
    }]

    return help;
}

exports.fillArrayWithIcons = (icons) => {
    let array = [];
    for (let index = 0; index < 3; index++) {
        array.push(icons[Math.floor(Math.random() * icons.length)])
    }

    let iconsEquals = array.every((val, i, arr) => val === arr[0]);
    return array;
}