import { connectMongodb } from '../config/database.js'

const start = (client) => {
    connectMongodb()
    setActivity(client)
    console.log("RokitaBOT ON!")
}

const setActivity = (client) => client.user.setActivity("-ayuda").then();

export { start }