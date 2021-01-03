import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })
        console.log(`MongoDb connected: ${con.connection.host}`.cyan.underline)
    } catch (error) {
        console.error(`error: ${error}`.red.underline.bold)
        process.exit(1)
    }
}

export default connectDB