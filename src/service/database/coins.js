const { coin } = require('../../model/coinSchema');

exports.chiboloCoins = (user, server, username) => {
    var coins = 1;
    coin.findOne({
        userID: user,
        serverID: server
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
        }else{
            res.money = res.money + coins;
            res.save().catch(err => console.log(err));
        }
    });
};

exports.getChiboloCoins = (user, server, username) => {
    var chiboloCoins;
    coin.findOne({
        userID: user,
        serverID: server,
    }, (err, res) => {
        if (err){
            console.log("Ocurrio un error en el metodo getChiboloCoins: " + err);
            chiboloCoins = undefined;
        }else{
            chiboloCoins = res;
        }
    });

    return chiboloCoins;
}

