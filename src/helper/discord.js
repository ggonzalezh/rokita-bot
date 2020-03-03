exports.createHelp = () => {
    let help = [{
        name: "Musica",
        value: "`!play` `!skip` `!stop` `!playlist` `!shuffle`"
    },
    {
        name: "Banco del Distrito Federal de Puno",
        value: "`!daily` `!coins`"
    },
    {
        name: "Casino de Juliaca",
        value: "`!bet`"
    }]

    return help;
}

exports.fillArrayWithIcons = (icons) => {
    let array = [];
    for (let index = 0; index < 3; index++) {
        array.push(icons[Math.floor(Math.random() * icons.length)])
    }

    let iconsEquals = array.every((val, i, arr) => val === arr[0]);
    return array;
}