const {MessageEmbed} = require('discord.js');

exports.createEmbedMessage = (author = undefined, fields = undefined, thumbNail = undefined, footer = undefined) => {
    let embed = new MessageEmbed();

    if (undefined !== author) {
        embed.setAuthor(author);
    }

    if (fields.length > 0) {
        for (const field of fields) {
            embed.addField(field.name, " " + field.value)
        }
    }

    if (undefined !== thumbNail) {
        embed.setThumbnail(thumbNail);
    }

    if (undefined !== footer) {
        embed.setFooter(footer.text, footer.icon);
    }
    embed.setColor(0x860202);

    return embed;
}

exports.createEmbedWithImage = (image) => {
    let embedImage = new MessageEmbed();

    embedImage.setImage(image);
    embedImage.setColor(0x860202);

    return embedImage;
}

exports.sendMessage = async (text, message) => {
    return await sendMessageId(text, message);
}

exports.sendNormalMessage = (text, message) => {
    message.channel.send(text);
}

exports.sendEmbedMessage = (embed, message) => {
    message.channel.send(embed);
}

exports.editMessage = (messageId, text, channel) => {
    channel.messages.fetch(messageId).then(message => {
        message.edit(text).then();
    }).catch((err) => {
        console.log(err);
    });
}

let sendMessageId = (text, message) => {
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