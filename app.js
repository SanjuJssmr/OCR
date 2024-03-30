import express from "express";
import dotenv from "dotenv"
import router from "./routes/ocr.js";
dotenv.config()
const PORT = process.env.PORT

const app = express();
app.use(express.json())
app.use("/",router)

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})