const mongoose = require('mongoose');

exports.connectMongoDb = (uri) => {
    mongoose.connect(uri, { useNewUrlParser: true }, (err, res) => {
        if (res) {
            console.log("Conectado MLAB");
        } else {
            console.log(err);
        }
    });
};