exports.createHelp = () => {
    let help = [
        {
            name: "¿Cómo usar el bot?",
            value: "El <@414719351338565632> responderá tus peticiones anteponiendo el signo `-` y el nombre del comando. Ejemplo: `-ayuda`."
        },
        {
            name: "Música",
            value:
                "`-play {link|titulo}`: Toca tu música preferida de Youtube en el canal. Puedes usar el link de la canción/playlist o buscarla por el título de la canción.\n   "
                + "`-skip`: Reproduce la siguiente canción de la playlist.\n"
                + "`-stop`: Detiene la reproducción playlist actual.\n"
                + "`-pause`: Pausa la reproducción de canciones de la playlist.\n"
                + "`-resume`: Reanuda la reproducción de canciones de la playlist.\n"
                + "`-volumen {nivel de volumen}`: Ajusta el volumen de reproducción de la playlist. los niveles de volumen van desde `0` al `2`.\n"
                + "`-playlist`: Mostrará las siguientes 5 canciones de la playlist.\n"
                + "`-shuffle`: Re-ordenara las canciones de la playlist."
        },
        {
            name: "Misión diaria",
            value:
                "`-registrar`: Registra tu cuenta en el servidor.\n   "
                + "`-recompensa`: Obtienes la recompensa diaria del servidor.\n"
                + "`-cuenta`: Despliega los datos de tu cuenta.\n"
                + "`-tabla`: Despliega la tabla de líderes."
        },
        {
            name: "Página Web",
            value:`[Rokita-BOT](https://rokitabot-cfc7e.web.app/)`
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