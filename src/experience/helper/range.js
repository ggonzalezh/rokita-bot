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
        name: 'El lavadora humana'
    },
    {
        level: 2,
        name: 'Peruano ADN de perdedor'
    },
    {
        level: 3,
        name: 'Chibolo'
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
        name: 'You wanna play with Yawar? I dont careeee.'
    },
    {
        level: 8,
        name: 'El Cacha Cholas'
    },
    {
        level: 9,
        name: 'EL EMPRESARIOOOOOOOOOOOOOOOO'
    },
    {
        level: 10,
        name: 'King EGG'
    }
];