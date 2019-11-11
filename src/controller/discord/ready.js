const { connectMongoDb } = require('../../service/database/connectService');

exports.logginCredentials = (client) => {
    connectToMongo();
    setActivityBot(client);
    console.log("RokitaBOT ON!");
}

let connectToMongo = () => {
    connectMongoDb("mongodb+srv://rokitabot:rokitabotqlo123@cluster-1-mpvuc.mongodb.net/rokitabot?retryWrites=true&w=majority");
}

let setActivityBot = (client) => {
    client.user.setActivity("-ayuda");
}