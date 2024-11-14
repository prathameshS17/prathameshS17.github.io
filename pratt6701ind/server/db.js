const {MongoClient} = require('mongodb')
require('dotenv').config();
const uri = process.env.DB_URI;

const connectDB = async () => {    
    try {
      const client = await MongoClient.connect(uri); 
      console.log('MongoDB connected');
      db = client.db('weatherData');
      return db;
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      process.exit(1); 
    }
};

module.exports = connectDB;