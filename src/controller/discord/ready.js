const { connectMongoDb } = require('../../service/database/connectService');

exports.logginCredentials = (client) => {
    connectToMongo();
    setActivityBot(client);
    console.log("RokitaBOT ON!");
}

let connectToMongo = () => {
    connectMongoDb("mongodb://misser:momito3914@ds217351.mlab.com:17351/rokitabot"/*process.env.MONGOLAB_URI*/);
}

let setActivityBot = (client) => {
    client.user.setActivity("!ayuda");
}