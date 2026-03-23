const express = require("express");
const cors = require("cors");
const dashboardRoutes = require("./routes/dashboardRoutes");
const menuRoutes = require("./routes/menuRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderItemRoutes = require("./routes/orderItemRoutes");
const Menu = require("./models/Menu");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 7. BONUS: FRONTEND SEDERHANA
// Route root yang merender HTML berisi data menu dinamis
app.get("/", async (req, res) => {
  try {
    const menus = await Menu.getAllMenus();
    
    let html = `
      <div style="font-family: Arial; padding: 20px;">
        <h2>🍛 Server is running: RESTO NASI PADANG PAGI SORE</h2>
        <p>Aplikasi backend berhasil tersambung ke database!</p>
        <table border="1" cellpadding="8" style="border-collapse: collapse; min-width: 400px; text-align: left;">
    `;
    
    if (menus.length > 0) {
      // Ambil kunci object (kolom database) secara dinamis
      const keys = Object.keys(menus[0]);
      html += "<tr style='background-color: #f2f2f2;'>" + keys.map(k => `<th>${k}</th>`).join("") + "</tr>";
      
      // Render setiap baris
      for (let m of menus) {
        html += "<tr>" + keys.map(k => `<td>${m[k]}</td>`).join("") + "</tr>";
      }
    } else {
      html += "<tr><td>Tidak ada data menu di tabel</td></tr>";
    }
    
    html += `
        </table>
        <br>
        <a href="/api/menus">Lihat Response JSON di /api/menus</a>
      </div>
    `;
    
    res.send(html);
  } catch (err) {
    res.send("Server is running, but database connection error: " + err.message);
  }
});

// Connect Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);

// 🔥 WAJIB: Export instance express agar bisa dibaca oleh server.js
module.exports = app;