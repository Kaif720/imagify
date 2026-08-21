import mongoose from "mongoose";

const conectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    })

  await mongoose.connect(`${process.env.MONGODB_URI}/imagify`)

console.log("DATABASE:", mongoose.connection.name)
}

export default conectDB;