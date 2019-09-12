const { coin } = require('../../model/coinSchema');
const { formatDate } = require('../../helper/utils');

exports.insertCoins = async (userId, serverId, username) => {
    return await insertCoinService(userId, serverId, username);
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
                    error: {
                        err
                    }
                })
            } else {
                if (res == null) {
                    resolve({
                        user: {
                            coins: undefined,
                            date: undefined
                        }
                    })
                } else {
                    resolve({
                        user: {
                            coins: res.coins,
                            date: res.date
                        }
                    });
                }
            }
        });
    });
}

var insertCoinService = (userId, serverId, userName) => {
    return new Promise((resolve, reject) => {
        coin.findOne({
            userID: userId,
            serverID: serverId
        }, (err, res) => {
            if (err) {
                reject({
                    error: {
                        err
                    }
                })
            } else {
                var dateNow = formatDate(new Date());
                if (res == null) {
                    var newUser = new coin({
                        userID: userId,
                        serverID: serverId,
                        userName: userName,
                        coins: 1000,
                        date: dateNow
                    })
                    newUser.save().catch(err => console.log(err));
                    resolve({
                        user: {
                            userName: newUser.userName,
                            coins: newUser.coins,
                            newUser: true
                        }
                    })
                } else {
                    res.coins = res.coins + 1000;
                    res.date = dateNow;
                    res.save().catch(err => console.log(err));
                    resolve({
                        user: {
                            userName: res.userName,
                            coins: res.coins,
                            date: res.date,
                            newUser: false
                        }
                    })
                }
            }
        });
    });
}