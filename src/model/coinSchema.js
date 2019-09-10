const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID : String,
    serverID : String,
    userName: String,
    money: Number
});

var coinSchema = mongoose.model("monedas", schema);

exports.coin = coinSchema;