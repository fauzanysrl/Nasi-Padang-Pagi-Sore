const express = require("express");
const app = express();

const db = require("./src/config/db");

// middleware
app.use(express.json());

// route test
app.get("/", (req, res) => {
    res.send("Server jalan + DB connect 🚀");
});

// test database
async function runTest() {
    try {
        const [rows] = await db.query("SELECT 1 + 1 AS solution");
        console.log("✔ Database connected");
        console.log("✔ Hasil query:", rows[0].solution);
    } catch (error) {
        console.error("❌ Error database:", error.message);
    }
}

// jalankan server + test
app.listen(3000, () => {
    console.log("Server running di http://localhost:3000");
    runTest();
});