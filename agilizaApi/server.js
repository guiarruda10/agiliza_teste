const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const filaRoutes = require("./src/routes/filaRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", filaRoutes);

connectDB().then(() => {
    app.listen(process.env.PORT, () => console.log(`Servidor rodando em: http://localhost:${process.env.PORT}`));
});
