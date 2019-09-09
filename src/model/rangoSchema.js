const mongoose = require('mongoose');

const schema = mongoose.Schema({
    rangoID : Number,
    rangoNombre : String
});

var rangoSchema = mongoose.model("rangos", schema);

exports.rangos = rangoSchema;