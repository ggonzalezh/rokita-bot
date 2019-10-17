const mongoose = require('mongoose');

const schema = mongoose.Schema({
    rangoID : Number,
    rangoNombre : String
});

let rangoSchema = mongoose.model("rangos", schema);

exports.rangos = rangoSchema;