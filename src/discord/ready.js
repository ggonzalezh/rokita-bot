const { connectMongoDb } = require('../service/connectService');

exports.logginCredentials = (client) => {
    connectToMongo();
    setActivityBot(client);
    console.log("RokitaBOT ON!");
}

let connectToMongo = () => {
    connectMongoDb(process.env.MONGOLAB_URI);
}

let setActivityBot = (client) => {
    client.user.setActivity("-ayuda").then();
}