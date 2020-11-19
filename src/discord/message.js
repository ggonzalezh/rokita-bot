import { MessageEmbed } from 'discord.js'

const createEmbedMessage = (author = undefined, fields = undefined, thumbNail = undefined, footer = undefined) => {
    let embed = new MessageEmbed()

    if (undefined !== author) embed.setAuthor(author)

    if (fields.length > 0) {
        for (const field of fields) (field.inline) ? embed.addField(field.name, " " + field.value, field.inline) : embed.addField(field.name, " " + field.value)
    }

    if (thumbNail) embed.setThumbnail(thumbNail)

    if (footer) embed.setFooter(footer.text, footer.icon)

    embed.setColor(0x860202);

    return embed;
}

const createEmbedWithImage = (image) => {
    let embedImage = new MessageEmbed();

    embedImage.setImage(image);
    embedImage.setColor(0x860202);

    return embedImage;
}

const sendMessage = async (text, message) => await sendMessageId(text, message)

const sendNormalMessage = (text, message) => message.channel.send(text);

const sendEmbedMessage = (embed, message) => message.channel.send(embed)

const editMessage = (messageId, text, channel) => channel.messages.fetch(messageId).then(message => message.edit(text).then()).catch((err) => console.log(err))

const sendMessageId = (text, message) => {
    return new Promise((resolve, reject) => {
        resolve(
            message.channel.send(`${message.author.toString()}, ${text}`).then(message => {
                return message.id
            }).catch(err => {
                console.log("asd");
            })
        )
    })
}

const createEmbedLeaderboards = (array, message) => {
    let embed = new MessageEmbed();
    let i = 1;
    embed.setAuthor(`Tabla de Líderes | ${message.guild.name}`, message.guild.iconURL());
    embed.setDescription(array.map(value => {
        let medal = '';
        (i === 1) ? medal = '🥇' : (i === 2) ? medal = '🥈' : (i === 3) ? medal = '🥉' : medal = '🎖️'
        let frase = `${medal} ${value.userName} - Nivel ${value.level}`;
        i++
        return frase;
    }))

    return embed
}

export { createEmbedMessage, createEmbedWithImage, sendMessage, sendNormalMessage, sendEmbedMessage, editMessage }