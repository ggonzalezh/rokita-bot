const { coinSchema } = require('../schema/coinSchema');
const { formatDate } = require('../../helper/utils');


exports.addToSystemCoins = async(userId, serverId, userName) =>{
    try{
        let newUser = new coinSchema({
            userId: userId,
            serverId: serverId,
            userName: userName,
            coins: 1
        })
    }catch(err){
        sendErrorConsole(err);
    }
}
exports.insertCoins = async (userId, serverId, userName) => {
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
                let dateNow = formatDate(new Date());
                if (res == null) {
                    let newUser = new coin({
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

let getCoinService = (userId, serverId) => {
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

let insertCoinService = (userId, serverId, userName) => {

}

let winCoinsService = (userId, serverId, coinsAdded) => {
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

let loseCoinsService = (userId, serverId, coinsLoses) => {
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

let findAllCoinsService = (serverId) => {
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