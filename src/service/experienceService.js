const {experience} = require('../experience/model/experienceSchema');
const {getRanges} = require('../experience/helper/range');
const {sendErrorConsole, formatDate} = require('../helper/utils');

exports.giveExperience = async (userId, serverId, userName) => {
    return insertExperienceToPlayerService(userId, serverId, userName);
}

exports.newUserLeveling = async (userId, serverId, userName) => {
    return await insertNewUser(userId, serverId, userName);
}

exports.getStatsPlayers = async (userId, serverId) => {
    return getStatsService(userId, serverId);
}

let insertNewUser = (userId, serverId, userName) => {
    return new Promise((resolve, reject) => {
        experience.findOne({
            userId: userId,
            serverId: serverId,
        }, (err, res) => {
            if (err) {
                reject({
                    error: {
                        err
                    }
                })
            } else {
                let newUser = new experience({
                    userId: userId,
                    serverId: serverId,
                    userName: userName,
                    level: 1,
                    experience: 0,
                    range: getRanges(1),
                    nextExperienceToLevelUp: 10,
                    lastUpdate: formatDate(new Date())
                })
                newUser.save().then(response => {
                    resolve({
                        user: {
                            userName: newUser.userName,
                            level: newUser.level,
                            range: newUser.range,
                            experience: newUser.experience,
                            nextExperienceToLevelUp: newUser.nextExperienceToLevelUp
                        }
                    })
                }).catch(err => {
                    sendErrorConsole(err)
                });
            }
        });
    });
};

let insertExperienceToPlayerService = (userId, serverId) => {
    try {
        return new Promise((resolve, reject) => {
            experience.findOne({
                userID: userId,
                serverId: serverId
            }, (err, res) => {
                if (err) {
                    reject({
                        error: {
                            err
                        }
                    })
                } else {
                    if (res.nextExperienceToLevelUp === res.experience) {
                        let newLevel = res.level++;
                        res.level = newLevel;
                        res.range = getRanges(newLevel);
                        res.nextExperienceToLevelUp = 10;
                        res.lastUpdate = formatDate(new Date());
                        res.experience = 0;
                        res.save().catch(err => sendErrorConsole(err));
                        resolve({
                            user: {
                                userName: res.userName,
                                stats: {
                                    level: res.level,
                                    range: res.range,
                                    experience: res.experience,
                                    levelUp: true
                                }
                            }
                        })
                    } else {
                        res.experience = res.experience++;
                        res.lastUpdate = formatDate(new Date());
                        res.save().catch(err => sendErrorConsole(err));
                        resolve({
                            user:{
                                userName: res.userName,
                                stats:{
                                    level: res.level,
                                    range: res.range,
                                    experience: res.experience,
                                    levelup: false
                                }
                            }
                        })
                    }
                }
            })
        });
    } catch (err) {
        sendErrorConsole(err);
    }
};

let getStatsService = (userId, serverId) => {
    try {
        return new Promise((resolve, reject) => {
            experience.findOne({
                userId: userId,
                serverId: serverId
            }, (err, res) => {
                if (err) {
                    reject({
                        error: {
                            err
                        }
                    })
                } else {
                    if (null === res) {
                        resolve({
                            user: {
                                userId: undefined,
                                serverId: undefined,
                                userName: undefined,
                                lastUpdate: undefined,
                                stats: {}
                            }
                        })
                    } else {
                        resolve({
                            user: {
                                userId: res.userId,
                                serverId: res.serverId,
                                userName: res.userName,
                                lastUpdate: res.lastUpdate,
                                stats: {
                                    level: res.level,
                                    experience: res.experience,
                                    range: res.experience,
                                    nextExperienceToLevelUp: res.nextExperienceToLevelUp
                                }
                            }
                        })
                    }
                }
            })
        })
    } catch (err) {
        sendErrorConsole(err);
    }
}