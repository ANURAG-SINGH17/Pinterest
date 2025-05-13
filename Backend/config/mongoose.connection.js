const mongoose = require('mongoose');

const uri = process.env.MONGO_ATLAS;

async function connectDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, 
        });

        console.log("Successfully connected to MongoDB Atlas!");
    } catch (error) {
        console.error(" MongoDB Connection Error:", error);
        process.exit(1);
    }
}

module.exports = connectDB;
