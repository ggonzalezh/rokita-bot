const { connectMongoDb } = require('../service/connectService');

exports.logginCredentials = (client) => {
    connectToMongo();
    setActivityBot(client);
    console.log("RokitaBOT ON!");
}

let connectToMongo = () => {
    //connectMongoDb(process.env.MONGOLAB_URI);
    connectMongoDb('mongodb://rokitabot:z6Dr85DnzKBBIKhm@cluster-1-shard-00-00-mpvuc.mongodb.net:27017,cluster-1-shard-00-01-mpvuc.mongodb.net:27017,cluster-1-shard-00-02-mpvuc.mongodb.net:27017/test?ssl=true&replicaSet=Cluster-1-shard-0&authSource=admin&retryWrites=true&w=majority');
}

let setActivityBot = (client) => {
    client.user.setActivity("-ayuda").then();
}
