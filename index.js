const discord = require("discord.js");
const ytdl = require("ytdl-core");
const dtdl = require('ytdl-core-discord');
const moment = require("moment");
const acostadazo = require("./modelo/acostadazo.js")
const monedas = require("./modelo/monedas.js");
const array = require("./arrays");
const mongoose = require('mongoose');
const experiencia = require("./modelo/experiencia.js");
const rangos = require("./modelo/rangos.js");

//Activar comandos
const prefix = "!";

var bot = new discord.Client();
var servers = {};
var cancionActual;
var linkCancion;
var chiboloCoins;
var uriString = process.env.MONGOLAB_URI;



//FUNCION DE LA MUSICA
async function play(connection, message) {
    var server = servers[message.guild.id];
    server.dispatcher = connection.playOpusStream(await dtdl(server.queue[0]));
    linkCancion = server.queue[0];
    ytdl.getInfo(server.queue[0], function (err, info) {
        cancionActual = info.title;
        var embed = new discord.RichEmbed()
            .addField("Sonando Ahora", " " + cancionActual)
            .addField("Link del tema", " " + linkCancion)
            .setThumbnail("https://thumbs.gfycat.com/FreeEnragedGrasshopper-size_restricted.gif")
            .setColor(0x860202)
        message.channel.send(embed);
    });
    server.queue.shift();
    server.dispatcher.on("end", function () {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

mongoose.connect(uriString, function (err, res) {
    if (res) {
        console.log("Conectado a la base de datos de mLAB");
    } else {
        console.log("Ocurrio un error en MongoDB => " + err);
    }
});


//BOT ENCENDIDO
bot.on("ready", function () {
    console.log("Rokitabot ON!");
    bot.user.setActivity("!Ayuda");
});

//INGRESA UN NUEVO MIEMBRO AL DISCORD
bot.on("guildMemberAdd", function (member) {
    member.guild.channels.find("name", "general").sendMessage(member.toString() + " Bienvenido, " + array.bienvenido[Math.floor(Math.random() * array.bienvenido.length)]);
});

//COMANDOS POR CHAT
bot.on("message", function (message) {
    if (message.author.equals(bot.user)) return;
    chiboloCoins = 1;
    monedas.findOne({
        userID: message.author.id,
        serverID: message.guild.id
    }, (err, money) => {
        if (err) console.log(err);
        if (!money) {
            const nuevasMonedas = new monedas({
                userID: message.author.id,
                serverID: message.guild.id,
                userName: message.author.username,
                money: chiboloCoins
            })
            nuevasMonedas.save().catch(err => console.log(err));
        } else {
            money.money = money.money + chiboloCoins;
            money.save().catch(err => console.log(err));
        }
    });

    //SISTEMA DE NIVELES
    experiencia.findOne({
        userID: message.author.id,
        serverID: message.guild.id
    }, (err, exp) => {
        if (err) {
            console.log("Ocurrio un error en el sistema de niveles. ERROR: " + err);
        }
        if (!exp) {
            const newUser = new experiencia({
                username: message.author.username,
                userID: message.author.id,
                serverID: message.guild.id,
                level: 1,
                puntos: 0,
                rango: "Sin rango"
            })
            newUser.save().catch(err => console.log(err));
        } else {
            console.log("Puntos de BD: "+exp.puntos);
            exp.puntos = exp.puntos + 1;
            let curLevel = Math.floor(0.1 * Math.sqrt(exp.puntos));
            console.log("Math: "+curLevel);
            if (exp.puntos < curLevel) {
                exp.level = exp.level + 1;
                message.channel.send("subiste a nivel "+ exp.level);
            }
            rangos.findOne({
                rangoID: exp.level
            }, (err, rango) => {
                if (err) {
                    console.log("Ocurrio un error en la obtencion de niveles");
                } else {
                    exp.rango = rango.rangoNombre
                    exp.save().catch(err => console.log(err));
                }
            });
        }
    });
    if (!message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");
    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
                message.channel.sendMessage(message.author.toString() + " Falto el link de la canción. Más Vivaldi, menos Pavarotti.");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage(message.author.toString() + " Tienes que estar en el canal para usar el comando !Play.");
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            var linkValido = ytdl.validateURL(args[1]);

            if (linkValido == true) {
                server.queue.push(args[1]);
                ytdl.getInfo(server.queue[0], function (err, info) {
                    cancionActual = info.title;
                    var embed = new discord.RichEmbed()
                        .addField("Cancion Agregada", " " + cancionActual)
                        .setColor(0x860202)
                    message.channel.send(embed);
                });
                if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                    play(connection, message);
                });
            } else {
                var embed = new discord.RichEmbed()
                    .addField("ERROR", " " + "La url solo puede ser de youtube")
                    .setThumbnail("https://cdn2.iconfinder.com/data/icons/freecns-cumulus/32/519791-101_Warning-128.png")
                    .setColor(0x860202)
                message.channel.send(embed);
            }
            break;
        case "skip":
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            var embed = new discord.RichEmbed()
                .addField("**:fast_forward: FOME TU WEA :fast_forward:**", ":regional_indicator_a: :regional_indicator_c: :regional_indicator_o: :regional_indicator_s: :regional_indicator_t: :regional_indicator_a: :regional_indicator_r: :regional_indicator_s: :regional_indicator_e:")
                .setColor(0x860202)
            message.channel.send(embed);
            break;
        case "stop":
            var server = servers[message.guild.id];
            if (message.guild.voiceConnection) {
                var embed = new discord.RichEmbed()
                    .addField("FUE WENO", ":mute: Cago la C L O W N - F I E S T A")
                    .setColor(0x860202)
                message.channel.send(embed);
                message.guild.voiceConnection.disconnect();
            }
            break;
        case "acostadazo":
            if (!args[1]) {
                var embed = new discord.RichEmbed()
                    .setAuthor(message.author.username)
                    .addField("Comando mal ingresado", " " + "!acostadazo [@NOMBRE DEL INDIVIDUO] [COMENTARIO]")
                    .setColor(0x860202)
                    .setThumbnail("https://cdn2.iconfinder.com/data/icons/freecns-cumulus/32/519791-101_Warning-128.png")
                message.channel.sendMessage(embed);
                return;

            }

            if (!args[2]) {
                var embed = new discord.RichEmbed()
                    .setAuthor(message.author.username)
                    .addField("Comando mal ingresado", " " + "!acostadazo [@NOMBRE DEL INDIVIDUO] [COMENTARIO]")
                    .setColor(0x860202)
                    .setThumbnail("https://cdn2.iconfinder.com/data/icons/freecns-cumulus/32/519791-101_Warning-128.png")
                message.channel.sendMessage(embed);
                return;

            }
            var mencionUsuario = message.mentions.members.first();
            if (args[1] != mencionUsuario) {
                var embed = new discord.RichEmbed()
                    .setAuthor(message.author.username)
                    .addField("Comando mal ingresado", " " + "!acostadazo [@NOMBRE DEL INDIVIDUO] [COMENTARIO]")
                    .addField("Aclaracion", " " + "El nombre del individuo a reportar debe ser con el @")
                    .setColor(0x860202)
                    .setThumbnail("https://cdn2.iconfinder.com/data/icons/freecns-cumulus/32/519791-101_Warning-128.png")
                message.channel.sendMessage(embed);
                return;
            } else {
                var fecha = moment(message.createdAt).format('DD/MM/YYYY');

                var comentarioFinal = "";

                for (let i = 2; i < args.length; i++) {
                    let comentario = args[i];
                    comentarioFinal = comentarioFinal + " " + comentario;
                }

                let report = new acostadazo({
                    _id: mongoose.Types.ObjectId(),
                    reportado: mencionUsuario.user.username,
                    idReportado: mencionUsuario.id,
                    razon: comentarioFinal,
                    reportadoPor: message.author.username,
                    reportadoPorId: message.author.id,
                    fechaReporte: fecha
                });

                report.save()
                    .catch(err => console.log(err));

                message.reply("Tu registro fue completado exitosamente");
            }
            break;
        case "registro":
            if (!args[1]) {
                var embed = new discord.RichEmbed()
                    .setAuthor(message.author.username)
                    .addField("Comando mal ingresado", " " + "!registro [@NOMBRE DEL INDIVIDUO] [FECHA]")
                    .setColor(0x860202)
                    .setThumbnail("https://cdn2.iconfinder.com/data/icons/freecns-cumulus/32/519791-101_Warning-128.png")
                message.channel.sendMessage(embed);
                return;
            }

            if (!args[2]) {
                var embed = new discord.RichEmbed()
                    .setAuthor(message.author.username)
                    .addField("Comando mal ingresado", " " + "!registro [@NOMBRE DEL INDIVIDUO] [FECHA]")
                    .setColor(0x860202)
                    .setThumbnail("https://cdn2.iconfinder.com/data/icons/freecns-cumulus/32/519791-101_Warning-128.png")
                message.channel.sendMessage(embed);
                return;
            }
            var mencionUsuario = message.mentions.members.first();
            if (args[1] != mencionUsuario) {
                var embed = new discord.RichEmbed()
                    .setAuthor(message.author.username)
                    .addField("Comando mal ingresado", " " + "!registro [@NOMBRE DEL INDIVIDUO] [FECHA]")
                    .addField("Aclaracion", " " + "El nombre del individuo a debe ser con el @")
                    .setColor(0x860202)
                    .setThumbnail("https://cdn2.iconfinder.com/data/icons/freecns-cumulus/32/519791-101_Warning-128.png")
                message.channel.sendMessage(embed);
                return;
            } else {
                acostadazo.find({
                    reportado: mencionUsuario.user.username,
                    idReportado: mencionUsuario.id,
                    fechaReporte: args[2]
                }, (err, registro) => {
                    if (err) console.log(err);
                    let embed = new discord.RichEmbed()
                    if (!registro) {
                        embed.setAuthor("Registro de Acostadazos")
                        embed.addField("Personaje involucrado ", " " + mencionUsuario.user.username)
                        embed.addField("Sin antecedentes", " " + "No se encontraron registro de acostadazos")
                        embed.setThumbnail("https://cdn.drawception.com/images/panels/2016/4-22/LmOkddqs2j-4.png")
                        embed.setColor(0x860202)
                        return message.channel.send(embed);
                    } else {
                        registro.forEach(function (elemento) {
                            embed.setAuthor("Registros de Acostadazos de: " + elemento.reportado)
                            embed.addField("Última vez visto", " " + elemento.fechaReporte)
                            embed.addField("Comentario", " " + elemento.razon);
                            embed.addField("Reporte hecho por", " " + elemento.reportadoPor);
                            embed.addBlankField();
                            embed.setFooter("FIN DEL REPORTE", "https://i.imgur.com/MpdmmVO.png")
                            embed.setThumbnail("https://cdn.drawception.com/images/panels/2016/4-22/LmOkddqs2j-4.png")
                            embed.setColor(0x860202)
                        })
                        return message.channel.send(embed);
                    }
                })
            }
            break;
        case "chibolocoins":
            monedas.findOne({
                userID: message.author.id,
                serverID: message.guild.id
            }, (err, monedaSwitch) => {
                if (err) console.log(err);
                let embed = new discord.RichEmbed()
                    .setTitle("Banco del Distrito Federal de Puno")
                    .addField("Propietario de la cuenta", " " + message.author.username)
                    .setColor(0x860202)
                    .setThumbnail("https://image.flaticon.com/icons/png/512/275/275806.png");
                if (!monedaSwitch) {
                    embed.addField("Chibolo-Coins", "0", true);
                    return message.channel.send(embed);
                } else {
                    embed.addField("Chibolo-Coins", monedaSwitch.money, true);
                    return message.channel.send(embed);
                }
            });
            break;
        case "peruano":
            message.channel.send(" **EL PERUANO:** Durante su niñez es obligado a ordeñar cabras,"
                + " vacas, limpiar establos.\n"
                + " El peruano siembra papas, cebollas  y hace trabajos agrarios!!\n"
                + " El peruano no se baña, no estudia, no va a la escuela, al colegio, no va a la universidad. Es un ser ignorante, torpe,\n"
                + " cerrado, bruto, estupido, soez, repugnante.\n"
                + "--------------------------------\n"
                + " Que es peruano en latín ???\n"
                + " Indius hediondus monus.\n"
                + "--------------------------------\n"
                + " Como reconocer a un peruano es la cosa más facil, aqui citamos sus principales caracteristicas: \n"
                + " 0- Son feos, horribles, abyectos, insignificantes, hediondos.\n"
                + " 1- Son marrones, color caca, tirando para cobrizos, parecen mojones.\n"
                + " 2- Son enanos, 1M50 a 1M60, parecen duendes andinos.\n"
                + " 3- Son patas cortas o pata chueca, verdaderos engendros de la naturaleza.\n"
                + " 4- No tienen culo, ni hombres ni mujeres.\n"
                + " 5- No tienen cuello, parecen gusanos con lodo.\n"
                + " 6- Tienen la tremenda nariz de condor o tucan.\n"
                + " 7- Son orejones, ya los españoles los llamaban asi.\n"
                + " 8- son achinados y no tienen parpados.\n"
                + " 9- Tienen pomulos salientes.\n"
                + " 10- Tienen la cara redonda e hinchada, estos cara de guanaco."
            );
            message.channel.sendMessage("https://imgur.com/a/p4C6O");
            break;
        case "empresario":
            message.channel.sendMessage(" **EL PERUANO:** Durante su niñez es obligado a estudiar algebra,"
                + " medicina, llevar libros contables.\n"
                + " El peruano siembra contactos de negocio y hace trabajos en la industrias de servicios.\n"
                + " El peruano no necesita bañarse, ni estudiar, ni ir a la escuela, al colegio, ni a la universidad. Ya que es un ser educado,\n"
                + " diestro, extrovertido, sensible, correcto, fino y agradable.\n"
                + "--------------------------------\n"
                + " Que es peruano en latín ???\n"
                + " Americanos cesar maximus.\n"
                + "--------------------------------\n"
                + " Como reconocer a un peruano no es facil, dado sus grandes dotes, pero aqui citamos varias caracteristicas comunes: \n"
                + " 0- Son hermosos, nobles, importantes y honestos.\n"
                + " 1- Son blancos, color leche, tirando para plateados, parecen nordicos.\n"
                + " 2- Son altos, 2M10 a 2M20, parecen gigantes andinos.\n"
                + " 3- Son pata larga, verdaderos gigantes de la naturaleza.\n"
                + " 4- Tienen un esculpido trasero, especialmente sus guapas mujeres.\n"
                + " 5- Tienen un cuello musculoso, parecen fisicoculturistas.\n"
                + " 6- Tienen una nariz proporcionada de modelo o de actor de Hollywood.\n"
                + " 7- Son rubios o pelirrojo, ya los españoles los llamaban asi.\n"
                + " 8- son millonarios y no tienen deudas.\n"
                + " 9- Tienen una riqueza culturar prominente.\n"
                + " 10- Tienen cara europeo germánico, estos cara de los dioses del olimpo."
            );
            message.channel.sendMessage("https://imgur.com/a/75ZxC");
            break;
        case "elchileno":
            message.channel.sendMessage("CHILE ES UN PAIS RATERO, CHILE ES UN PUEBLO HEREDERO DE UN MESTIZAJE MALIGNO, CON INCLINACIONES PARA LA TRAICION, LA PELEA SUCIA, LA GUERRA DESIGUAL, SEMBRAR LA ENEMISTAD, DEBIDO A QUE NACEN ARRINCONADOS EN UNA TIERRA ESTERIL QUE DIFICILMENTE LES BRINDA EL SUSTENTO A SU POBLACION, POR ESO, EL CHILENO BUSCA ROBAR A SUS VECINOS DESDE SU FUNDACIÓN, POR ESO EXISTE TANTO CHILENO RATERO, ADEMAS DE CHILENOS RACISTAS, YA QUE, ASI COMO POSEEN UNA TIERRA VERGONZOSAMENTE PEQUEÑA, TAMBIEN POSEEN PROFUNDOS COMPLEJOS DE INFERIORIDAD DEBIDO A QUE NO POSEEN UNA RAZA QUE LOS IDENTIFIQUE, Y BUSCARAN PARECERSE A SUS AMOS BLANCOS, ASI TODO CHILENOS SEA SOLO UN TRISTE MESTIZO DEL DESIERTO");
            break;
        case "gachi":
            message.channel.sendMessage("<:gachigasm:278775386723188736> F <:gachigasm:278775386723188736> U <:gachigasm:278775386723188736> C <:gachigasm:278775386723188736> K <:gachigasm:278775386723188736> - <:gachigasm:278775386723188736> Y<:gachigasm:278775386723188736> O <:gachigasm:278775386723188736> U <:gachigasm:278775386723188736> -> https://www.youtube.com/watch?v=k4Ssaut4cs8");
            break;
        case "wow":
            var fechaActual = new Date()
            var fechaFormat = moment(fechaActual).format('YYYY');
            var embed = new discord.RichEmbed()
                .addField("WoW ?", "**En pleno " + fechaFormat + " ?**")
            embed.setImage(url = "https://media1.tenor.com/images/deb0f8c8abdc354a7740e6e72da55a6d/tenor.gif?itemid=9902854")
                .setColor(0x860202)
            message.channel.send(embed);
            break;
        case "cuenta":
            var fechaCreacion = moment(message.author.createdAt.toString()).format("DD/MM/YYYY");
            var embed = new discord.RichEmbed()
                .setAuthor("Información de la cuenta: ")
                .addField("Nickname", " " + message.author.username)
                .addField("Usuario", " " + message.author.tag)
                .addField("ID de la cuenta", " " + message.author.id)
                .addField("Fecha de creación", " " + fechaCreacion)
                .setColor(0x860202)
                .setThumbnail(message.author.avatarURL);
            message.channel.send(embed);
            break;
        case "profecia":
            var embed = new discord.RichEmbed()
            embed.setImage(url = "https://cdn.discordapp.com/attachments/162680914634211328/414262110218878976/HAIL_RAIGOR_SEASON_1.png")
                .setColor(0x860202)
            message.channel.send(embed);
            break;
        case "piel":
            message.channel.sendMessage(message.author.toString() + " Tu color de piel es " + array.color[Math.floor(Math.random() * array.color.length)]);
            break;
        case "tmr":
            var embed = new discord.RichEmbed()
                .addField("Un sabio peruano  :flag_pe: dijo una vez: ", "AGG TMRE !! " + array.dota[Math.floor(Math.random() * array.dota.length)] + " .Ya fue esta webada csmr, para esto no pago la cabina.")
                .setColor(0x860202)
            message.channel.send(embed);
            break;
        case "10dif":
            var embed = new discord.RichEmbed()
                .addField(message.author.toString(), "Encuentra las 10 diferencias:")
            embed.setImage(url = "https://i.imgur.com/T3sz6X5.jpg")
                .setColor(0x860202)
            message.channel.sendMessage(embed);
            break;
        case "ayuda":
            var embed = new discord.RichEmbed()
                .addField("Comandos del cerro", ":flag_pe: VIVA PERU CMSR :flag_pe:")
                .addField("Musica", "`!Play` `!Skip` `!Stop`")
                .addField("Registro de Acostadazos", "`!Acostadazo` `!Registro`")
                .addField("Banco del Distrito Federal de Puno", "`!Chibolocoins`")
                .addField("C L O W N S", "`!Peruano` `!Empresario` `!Elchileno` `!Tmr` `!Piel` `!Gachi`")
                .addField("Misceláneo", "`!Cuenta` `!Profecia` `!10dif`")
                .setColor(0x860202)
            message.channel.sendMessage(message.author.toString() + " **Inbox perrito !** :incoming_envelope:")
            message.author.send(embed);
            break;
        default:
            var embed = new discord.RichEmbed()
            embed.setImage("https://pa1.narvii.com/6565/59fb4390472f0373a936595a2b1bd36a4e171520_hq.gif")
                .addField(message.author.username, "No existe ese comando, " + array.bienvenido[Math.floor(Math.random() * array.bienvenido.length)])
                .setColor(0x860202)
            message.channel.sendMessage(embed);
    }
});

bot.login(process.env.BOT_TOKEN);
mongoose.connect(uriString);
