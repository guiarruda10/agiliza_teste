const mongoose = require("mongoose");
require("dotenv").config(); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB conectado")
    } catch(error) {
        console.error("Erro na conexão do MongodDB", error);
    };
}

module.exports = connectDB;