const { coin } = require('../../model/coinSchema');
const { formatDate } = require('../../helper/utils');

exports.insertCoins = async (userId, serverId, username) => {
    return await insertCoinService(userId, serverId, username);
};

exports.getCoins = async (userId, serverId) => {
    return await getCoinService(userId, serverId);
}

exports.winCoins = async (userId, serverId, coinsAdded) => {
    return await winCoinsService(userId, serverId, coinsAdded);
}

exports.loseCoins = async (userId, serverId, coinsLoses) => {
    return await loseCoinsService(userId, serverId, coinsLoses);
}

exports.findAllCoins = async (serverId) => {
    return await findAllCoinsService(serverId);
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

var winCoinsService = (userId, serverId, coinsAdded) => {
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
                res.coins = coinsAdded;
                res.save().catch(err => console.log(err));
                resolve({
                    user: {
                        coins: res.coins
                    }
                });
            }
        })
    });
}

var loseCoinsService = (userId, serverId, coinsLoses) => {
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
                res.coins = coinsLoses;
                res.save().catch(err => console.log(err));
                resolve({
                    user: {
                        coins: res.coins
                    }
                });
            }
        })
    });
}

var findAllCoinsService = (serverId) => {
    return new Promise((resolve, reject) => {
        coin.find({
            serverID: serverId
        }, (err, res) => {
            if (err) {
                reject({
                    error: {
                        err
                    }
                });
            } else {
                resolve({
                    users:{
                        res
                    }
                });
            }
        })
    })
}