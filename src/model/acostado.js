const mongoose = require('mongoose');

var schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reportado: String,
    idReportado: String,
    razon: String,
    reportadoPor: String,
    reportadoPorId: String,
    fechaReporte: String 
});

var acostadoSchema = mongoose.model("acostado", schema);

exports.acostado = acostadoSchema;