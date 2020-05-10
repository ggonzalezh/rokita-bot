const { bienvenido } = require("../helper/arrays");

exports.sayHello = (member) => {
    member.guild.channels.cache.find(role => role.name === "general").send(`${member.toString()} Bienvenido, ${bienvenido[Math.floor(Math.random() * bienvenido.length)]}.` + " Usa el comando `-ayuda` para más información.");
}

exports.sendMessageToChannel = (member, nameChannel, message) => {
    member.guild.channels.cache.find(role => role.name === nameChannel).send(`${member.toString()}, ` + message);
}

exports.addMemberToRole = member => {
    let role = member.guild.roles.cache.find(role => role.name === "Chibolin");
    member.roles.add(role);
  };