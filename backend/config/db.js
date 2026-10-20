const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurantDB";
        await mongoose.connect(uri);
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.log("MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
