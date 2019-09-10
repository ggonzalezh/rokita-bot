const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID : String,
    serverID : String,
    userName: String,
    coins: Number
});

var coinSchema = mongoose.model("coin", schema);

exports.coin = coinSchema;