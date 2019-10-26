const {experience} = require('../../model/experienceSchema');
const {getRango} = require('./rangosService');

exports.experienceSystem = (user, server, username) => {
    experience.findOne({
        userID: user,
        serverID: server
    }, (err, res) => {
        if (err) {
            console.log("Ocurrio un error en el sistema de niveles. ERROR: " + err);
            return
        }
        if (!res) {
            const newUser = new experience({
                username: username,
                userID: user,
                serverID: server,
                level: 1,
                puntos: 0,
                rango: "Sin rango"
            })
            newUser.save().catch(err => console.log(err));
        } else {
            res.puntos = res.puntos + 1;
            const curLevel = Math.floor(0.1 * Math.sqrt(res.puntos));
            if (res.puntos < curLevel) {
                res.level = res.level + 1;
            }
            let rango = getRango(res.level);
            res.rango = rango;
            res.save().catch(err => console.log(err));
        }
    });
}