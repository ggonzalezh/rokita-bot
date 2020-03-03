const mongoose = require('mongoose');

exports.connectMongoDb = (uri) => {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
        if (res) {
            console.log("Conectado mongoDB");
        } else {
            console.log(err);
        }
    });
};