const { RichEmbed } = require('discord.js');

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

exports.sendMessage = async (text, message) => {
    return await sendMessageId(text, message);
}

exports.sendEmbedMessage = (embed, message) => {
    message.channel.send(embed);
}

exports.editMessage = (messageId, text, channel) => {
    channel.fetchMessage(messageId).then(message => {
		message.edit(text);
	}).catch(() => {
		errorLog.error(`"Could not edit message ${messageId}" "${channel.guild.name}" "${text}"`);
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