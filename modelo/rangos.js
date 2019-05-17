const mongoose = require('mongoose');

const rangos = mongoose.Schema({
    rangoID : Number,
    rangoNombre : String
});

module.exports = mongoose.model("rangos", rangos);