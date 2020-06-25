const {coinSchema} = require('../schema/coinSchema');
const {sendErrorConsole, formatDate} = require('../../helper/utils');


exports.insertUserCoins = async (userId, serverId, userName) => {
    let userAdded = new coinSchema({
        userId: userId,
        serverId: serverId,
        userName: userName,
        coins: 0,
        lastUpdate: '1900-01-01'
    })

    return await userAdded.save();
}

exports.getCoinsStats = async (userId, serverId) => {
    const coins = await coinSchema.findOne(
        {
            userId: userId,
            serverId: serverId
        },
        {},
        {
            lean: true
        },
        (err, res) => {
            return (err) ? (() => {
                throw err;
            }) : res;
        }
    )

    return coins
}

exports.insertCoins = async (userId, serverId, user) => {
    const insert = await coinSchema.updateOne(
        {
            userId: userId,
            serverId: serverId
        },
        {
            coins: user.coins + 1000,
            lastUpdate: formatDate(new Date())
        }, (err, res) => {
            return (err || undefined === res) ? (() => {
                throw err
            }) : res;
        }
    )

    return insert;
}

exports.deleteCoins = async (userId, serverId, user, coinLess) => {
    const deletedCoins = await coinSchema.findOneAndUpdate(
        {
            userId: userId,
            serverId: serverId
        },
        {
            coins: user.coins - coinLess,
        },
        {
            lean: true
        },
        {}, (err, res) => {
            return (err) ? (() => {
                throw err;
            }) : res;
        });
    return deletedCoins;
}

exports.getAllCoinsInServer = async (userId, serverId) => {
    let allCoins = await coinSchema.find(
        {
            serverId: serverId
        }, (err, res) => {
            return (err || undefined === res) ? (() => {
                throw err
            }) : res
        })

    return allCoins;
}