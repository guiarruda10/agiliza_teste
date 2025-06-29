const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const filaRoutes = require("./src/routes/filaRoutes");

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://agiliza-app.onrender.com", // ajuste conforme domínio frontend em produção
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

app.use("/api", filaRoutes);

connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Servidor rodando em: http://localhost:${PORT}`));
});
