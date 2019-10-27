# RokitaBOT
Bot para la aplicación de [Discord](https://discordapp.com/), creado con [Node.js](https://nodejs.org/en/), [Discord.js](https://discord.js.org/#/) y [MongoDB](https://www.mongodb.com/cloud/atlas), hosteado en la plataforma nube [Heroku](https://heroku.com), para canal privado de amigos. Principales características:
1.	Reproducir el audio de los videos de Youtube en los canales de voz.
2.	Sistema de encolamiento de videos de Youtube.
3.	Sistema de niveles.
4.	Sistema de misión diaria.
5.	Sistema de monedas.
6.	Sistema de apuestas.

## Pre-Requisitos
### Obligatorios

* [Node.js](https://nodejs.org/en/): versión 6.0.0 o más nueva requerida.
* [MongoDB](https://www.mongodb.com/cloud/atlas)
* [Git](https://git-scm.com/downloads)

## Instalación
* Para windows, usar comando ```npm install``` para instalar las dependencias necesarias.
* Instalar [FFMPEG](https://ffmpeg.zeranoe.com/builds/) y agregarlo a las variables de entorno del sistema. Ejemplo: ```C:\ffmpeg\bin```

## Configuración
* Obtener token string de tu bot:  https://discordapp.com/developers
* Obtener token string del cluster la base de datos de MongoDB: https://www.mongodb.com/cloud
* Cambiar las variables ```process.env.BOT_TOKEN``` y ```process.env.MONGOLAB_URI``` con los respectivos token.

## Ejecutar Aplicación
* Usar el comando ```npm start```

## Autor
* **Guillermo González** - [ggonzalezh](https://github.com/ggonzalezh)