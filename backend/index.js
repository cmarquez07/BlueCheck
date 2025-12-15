import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import beachRoutes from "./routes/beachRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use("/api", beachRoutes);
app.use("/auth", authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend en ejecución en el puerto ${PORT}`);
});
