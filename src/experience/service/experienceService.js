const {experienceSchema} = require('../schema/experienceSchema');
const {getRanges} = require('../helper/range');
const {sendErrorConsole, formatDate} = require('../../helper/utils');

exports.insertUserStats = async (userId, serverId, userName) => {
    try {
        let newUser = new experienceSchema({

            userId: userId,
            serverId: serverId,
            userName: userName,
            level: 1,
            experience: 0,
            range: getRanges(1),
            experienceToLevelUp: 10,
            totalExperience: 1,
            lastUpdate: '1900-01-01'
        })
        return await newUser.save();
    } catch (err) {
        sendErrorConsole(err);
    }
}

exports.getExperienceStats = async (userId, serverId) => {
    const stats = await experienceSchema.findOne(
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
                throw err
            }) : res;
        }
    )
    return stats;
}

exports.insertExperience = async (userId, serverId, user) => {
    try {
        await experienceSchema.updateOne(
            {
                userId: userId,
                serverId: serverId
            },
            {
                experience: user.experience + 1,
                experienceToLevelUp: user.experienceToLevelUp - 1,
                totalExperience: user.totalExperience + 1,
                lastUpdate: formatDate(new Date())
            }, (err, res) => {
                return (err || undefined === res) ? (() => {
                    throw err
                }) : res;
            }
        )
    } catch (err) {
        sendErrorConsole(err);
        throw err;
    }
}

exports.rangeUp = async (userId, serverId, user) => {
    try {
        await experienceSchema.updateOne(
            {
                userId: userId,
                serverId: serverId
            },
            {
                experience: 0,
                experienceToLevelUp: 10,
                level: user.level + 1,
                range: getRanges(user.level + 1),
                totalExperience: user.totalExperience + 1,
                lastUpdate: formatDate(new Date())
            }, (err, res) => {
                return (err || res === undefined) ? (() => {
                    throw err
                }) : res;
            });
    } catch (err) {
        sendErrorConsole(err);
        throw err;
    }
}

exports.findAllUserStatsByServer = async (serverId) => {
    try {
        let users = await experienceSchema.find({
            serverId: serverId
        }, (err, res) => {
            return (err || undefined === res) ? (() => {
                throw err
            }) : res
        })

        return users;
    } catch (err) {
        sendErrorConsole(err);
    }
}