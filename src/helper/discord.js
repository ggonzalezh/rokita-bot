exports.createHelp = () => {
    let help = [
        {
            name: "¿Cómo usar el bot?",
            value: "El <@414719351338565632> responderá tus peticiones anteponiendo el signo `-` y el nombre del comando. Ejemplo: `-ayuda`."
        },
        {
            name: "Música",
            value: "`-play {link/titulo}`: Toca tu música preferida de Youtube en el canal. Puedes usar el link de la canción/playlist o buscarla por el título de la canción.\n   "
                + "`-skip`: Reproduce la siguiente canción de la playlist.\n"
                + "`-stop`: Detiene la reproducción playlist actual.\n"
                + "`-pause`: Pausa la reproducción de canciones de la playlist.\n"
                + "`-resume`: Reanuda la reproducción de canciones de la playlist.\n"
                + "`-volumen {nivel de volumen}`: Ajusta el volumen de reproducción de la playlist. Los niveles de volumen son: `bajo+` `bajo` `normal` `alto` `alto+`. \n"
                + "`-playlist`: Mostrará las siguientes 5 canciones de la playlist.\n"
                + "`-shuffle`: Re-ordenara las canciones de la playlist."
        },
        {
            name: "Banco del Distrito Federal de Puno",
            value: "`-daily`: Te hará entrega de $1000 coins en el servidor. Solo se puede usar una vez al día.\n"
                + "`-coins`: Te indicara cuantas coins en el servidor",
        },
        {
            name: "Casino de Juliaca",
            value: "`-bet`: Apuesta tus coins con este comando. Pepito paga doble."
        },
        {
            name: "Éxitos del ayer y hoy",
            value: "`-elperuano` `-elempresario` `-elchileno` `-profecia` `-vici`"
        }]

    return help;
}

exports.fillArrayWithIcons = (icons) => {
    let array = [];
    for (let index = 0; index < 3; index++) {
        array.push(icons[Math.floor(Math.random() * icons.length)])
    }

    return array;
}