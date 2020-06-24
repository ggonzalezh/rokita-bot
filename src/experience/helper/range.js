const {sendErrorConsole} = require('../../helper/utils');

exports.getRanges = (level) => {
    try{
        let rangoLevel = range.find(rango => rango.level === level)
        return rangoLevel.name
    }catch(err){
        sendErrorConsole(err);
    }
}

const range = [
    {
        level: 1,
        name: 'Peruano ADN de perdedor'
    },
    {
        level: 2,
        name: 'Chibolo'
    },
    {
        level: 3,
        name: 'You wanna play with Yawar? I dont careeee.'
    },
    {
        level: 4,
        name: 'Asi que yo soy el ignorante?'
    },
    {
        level: 5,
        name: 'Winter Wyvern de Overkill'
    },
    {
        level: 6,
        name: 'El Prossor'
    },
    {
        level: 7,
        name: 'EL PERUANOOOOOOOOOOOOOOO'
    },
    {
        level: 8,
        name: 'EL EMPRESARIOOOOOOOOOOOOOOOO'
    },
    {
        level: 9,
        name: 'Cacha Cholas'
    }
];