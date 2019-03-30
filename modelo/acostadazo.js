const mongoose = require('mongoose');

const acostadazo = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reportado: String,
    idReportado: String,
    razon: String,
    reportadoPor: String,
    reportadoPorId: String,
    fechaReporte: String 
});

module.exports = mongoose.model("Acostadazos", acostadazo);