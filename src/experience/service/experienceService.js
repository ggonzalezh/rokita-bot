const {experienceSchema} = require('../schema/experienceSchema');
const {getRanges} = require('../helper/range');
const {sendErrorConsole, formatDate} = require('../../helper/utils');

exports.addUser = (userId, serverId, userName) => {
    return new Promise((resolve, reject) => {
        let newUser = new experienceSchema({
            userId: userId,
            serverId: serverId,
            userName: userName,
            level: 1,
            experience: 1,
            range: getRanges(1),
            experienceToLevelUp: 10,
            totalExperience: 1,
            lastUpdate: formatDate(new Date())
        })
        newUser.save().then(() => {
            resolve({
                stats: {
                    userName: newUser.userName,
                    level: newUser.level,
                    range: newUser.range,
                    experience: newUser.experience,
                    experienceToLevelUp: newUser.experienceToLevelUp
                }
            })
        }).catch(err => {
            sendErrorConsole(err);
        });
    });
}

exports.getStats = (userId, serverId) => {
    try {
        return new Promise((resolve, reject) => {
            experienceSchema.findOne({
                userId: userId,
                serverId: serverId
            }, (err, res) => {
                if (err) {
                    reject({
                        error: {
                            err
                        }
                    })
                } else if (null === res || undefined === res) {
                    resolve({
                        info: {
                            userId: undefined,
                            serverId: undefined,
                            userName: undefined,
                            lastUpdate: undefined,
                            stats: {}
                        }
                    })
                } else {
                    resolve({
                        info: {
                            userId: res.userId,
                            serverId: res.serverId,
                            userName: res.userName,
                            lastUpdate: res.lastUpdate,
                            stats: {
                                level: res.level,
                                experience: res.experience,
                                range: res.range,
                                experienceToLevelUp: res.experienceToLevelUp,
                                totalExperience: res.totalExperience
                            }
                        }
                    })
                }
            })
        })
    } catch (err) {
        sendErrorConsole(err);
    }
}

exports.giveExperience = (userId, serverId, data) => {
    try {
        return new Promise((resolve, reject) => {
            experienceSchema.updateOne({
                userId: userId,
                serverId: serverId
            }, {
                experience: data.info.stats.experience + 1,
                experienceToLevelUp: data.info.stats.experienceToLevelUp - 1,
                totalExperience: data.info.stats.totalExperience + 1,
                lastUpdate: formatDate(new Date())
            }, (err, res) => {
                if (err || undefined === res) {
                    reject({
                        error: {
                            err
                        }
                    })
                } else {
                    resolve({
                        res
                    })
                }
            })
        })
    } catch (err) {
        sendErrorConsole(err);
    }
}