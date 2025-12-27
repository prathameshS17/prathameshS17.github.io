const { MongoClient } = require("mongodb")
require("dotenv").config()

const client = new MongoClient(process.env.MONGO_URI);

async function connectDB (){
    try{
        await client.connect()
        console.log("connected to mongoDB")
        return client.db("real-time-editor")
    }catch(error){
        console.error("❌ MongoDB connection failed:", error)
        process.exit(1)
    }
}

module.exports = connectDB

