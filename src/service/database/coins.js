const { coin } = require('../../model/coinSchema');

exports.chiboloCoins = (userId, serverId, username) => {
    var coins = 1;
    coin.findOne({
        userID: userId,
        serverID: serverId
    }, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        if (!res) {
            var newUser = new coin({
                userID: user,
                serverID: server,
                userName: username,
                money: coins
            })
            newUser.save().catch(err => console.log(err));
        } else {
            res.money = res.money + coins;
            res.save().catch(err => console.log(err));
        }
    });
};

exports.getChiboloCoins = async (userId, serverId) => {
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
                    err
                })
            } else {
                resolve({
                    user:{
                        coins: res.money
                    }
                });
            }
        });
    });
}

