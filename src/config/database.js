import mongoose from 'mongoose'

const url = process.env.MONGOLAB_URI;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    keepAlive: 30000,
    connectTimeoutMS: 20000,
}

const connectMongodb = async () => await mongoose.connect(url, options).then(() => console.log('Connected to Mongodb')).catch((err) => console.log(`Failed to connect to Mongodb: ${err}`))

export { connectMongodb }