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
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando em: http://localhost:${PORT}`));
});
