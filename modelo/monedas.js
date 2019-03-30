const mongoose = require('mongoose');

const monedas = mongoose.Schema({
    userID : String,
    serverID : String,
    userName: String,
    money: Number
});

module.exports = mongoose.model("Monedas", monedas);