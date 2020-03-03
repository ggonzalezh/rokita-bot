const { bienvenido } = require("../helper/arrays");

exports.sayHello = (member) => {
    member.guild.channels.find(role => role.name === "general").send(member.toString() + " Bienvenido, " + bienvenido[Math.floor(Math.random() * bienvenido.length)]);
}

exports.sendMessageToChannel = (member, nameChannel, message) => {
    member.guild.channels.find(role => role.name === nameChannel).send(`${member.toString()}, ` + message);
}
