# Postman API Testing Guide & Backend Fixes

Sebagai **Senior Backend Developer**, saya telah menyelesaikan debugging dan standarisasi API backend agar siap dites menggunakan Postman.

## 🛠 Apa yang Sudah Diperbaiki?
* **Standarisasi JSON Response**: Seluruh endpoint sekarang memiliki response seragam yang mempermudah integrasi frontend:
  ```json
  {
    "success": true,
    "message": "Pesan deskriptif",
    "data": { ... },
    "meta": { "total": 0 } // opsional untuk endpoint yang me return array list
  }
  ```
* **Input Validation (Anti 500 Error)**: Menangani error karena parameter wajib di `req.body` yang kosong, mencegah proses query dijalankan dan langsung merespon HTTP 400 (Bad Request).
* **Consisten Error Catching**: Menangkap error saat query (misalnya pelanggaran rule database, field unknown) dan merespon HTTP 500 secara damai dengan `error: error.message`, bukan server crash.

---

## 🚀 Panduan Postman & Contoh Endpoint

Berikut adalah rekap cara ngetes endpoint-endpoint krusial di Postman. Asumsi base URL: `http://localhost:3000/api`.

### 1. Categories
* **GET `/categories`**
  * ☑️ Method: `GET` -> `http://localhost:3000/api/categories`
  * ✅ Success Response:
    ```json
    { "success": true, "message": "Berhasil mengambil data kategori", "data": [...], "meta": {"total": 2} }
    ```
* **POST `/categories`**
  * ☑️ Method: `POST` -> `http://localhost:3000/api/categories`
  * 📦 Body (`raw` -> `JSON`): `{ "name": "Minuman", "description": "Aneka jus" }`
  * ✅ Success Response:
    ```json
    { "success": true, "message": "Berhasil menambahkan kategori", "data": { "id": 1, "name": "Minuman", "description": "Aneka jus" } }
    ```
  * ❌ Error (Lupa field name): `400 Bad Request`
    ```json
    { "success": false, "message": "Field name wajib diisi", "data": null }
    ```

### 2. Menus
*Endpoint Menu menggunakan Multer, jadi POST/PUT wajib menggunakan form-data bukan RAW JSON jika ada image.*

* **POST `/menus`**
  * ☑️ Method: `POST` -> `http://localhost:3000/api/menus`
  * 📦 Body (`form-data`):
    * `name`: Nasi Rendang (Text)
    * `category_id`: 1 (Text)
    * `price`: 30000 (Text)
    * `status`: available (Text)
    * `image`: [Pilih Foto] (File) -> *Opsional*
  * ✅ Success Response: HTTP 201 dengan struktur JSON standar.
  * ❌ Error (Kurang field price dsb): `400 Bad Request`
    ```json
    { "success": false, "message": "Field name, category_id, dan price wajib diisi", "data": null }
    ```

### 3. Orders
* **POST `/orders`**
  * ☑️ Method: `POST` -> `http://localhost:3000/api/orders`
  * 📦 Body (`raw` -> `JSON`):
    ```json
    { "user_id": 1, "customer_name": "Pak Budi", "table_number": "Meja 4", "total_price": 60000, "status": "pending" }
    ```
  * ✅ Success Response:
    ```json
    { "success": true, "message": "Berhasil membuat pesanan", "data": { "id": 1, "user_id": 1, "customer_name": "Pak Budi", "table_number": "Meja 4", "total_price": 60000, "status": "pending" } }
    ```
  * ❌ Error (Foreign Key Constraint, semisal user_id 1 belum terdaftar di tabel Users): `500 Internal Server Error`
    ```json
    { "success": false, "message": "Gagal membuat pesanan", "data": null, "error": "Cannot add or update a child row: a foreign key constraint fails..." }
    ```

---

## 💾 Script SQL Integrasi Database 
Jika saat testing terdapat field yang *Unknown column* atau tabel tidak ada, jalankan script ini di MySQL klien (seperti phpMyAdmin atau DBeaver) untuk membuat struktur yang pas dengan model controller.

```sql
-- 1. users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'cashier') DEFAULT 'cashier',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. categories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. menus
CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('available', 'sold_out') DEFAULT 'available',
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 4. orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    table_number VARCHAR(50) NOT NULL,
    total_price DECIMAL(10, 2) DEFAULT 0,
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. order_items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

-- 6. reservations
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    reservation_time DATETIME NOT NULL,
    table_number VARCHAR(50) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
