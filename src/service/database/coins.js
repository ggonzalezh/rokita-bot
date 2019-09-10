const { coin } = require('../../model/coinSchema');

exports.insertCoins = (userId, serverId, username) => {
    insertCoinService(userId, serverId, username);
};

exports.getCoins = async (userId, serverId) => {
    return await getCoinService(userId, serverId);
}

var getCoinService = (userId, serverId) => {
    return new Promise((resolve, reject) => {
        coin.findOne({
            userID: userId,
            serverID: serverId,
        }, (err, res) => {
            if (err) {
                reject({
                    error:{
                        err
                    }
                })
            } else {
                resolve({
                    user: {
                        coins: res.coins
                    }
                });
            }
        });
    });
}

var insertCoinService = (userId, serverId, userName) => {
    coin.findOne({
        userID: userId,
        serverID: serverId
    }, (err, res) => {
        if (err) {
            console.log("Ocurrió un error al insertar coins al sistema");
        } else {
            if (!res) {
                var newUser = new coin({
                    userID: userId,
                    serverID: serverId,
                    userName: userName,
                    coins: 1
                })
                newUser.save().catch(err => console.log(err));
            } else {
                res.coins = res.coins + 1;
                res.save().catch(err => console.log(err));
            }
        }
    });
}