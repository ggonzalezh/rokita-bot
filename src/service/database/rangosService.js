const { rangos } = require('../../model/rangoSchema');

exports.getRango = (level) => {
    var rango;
    rangos.findOne({
        rangoID: level
    }, (err, res) => {
        if (err) {
            console.log("Ocurrio un error en la obtencion de niveles");
            rango = undefined;
        } else {
            rango = res.rangoNombre
        }
    });

    return rango;
}