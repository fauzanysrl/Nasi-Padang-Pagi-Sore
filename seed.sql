-- Insert dummy menus if table is empty (assuming category_id = 1 exists)
INSERT IGNORE INTO categories (id, name, description) VALUES (1, 'Main Course', 'Lauk Pauk Utama');
INSERT IGNORE INTO menus (id, name, price, category_id, status) VALUES 
(1, 'Rendang Sapi', 25000, 1, 'available'),
(2, 'Ayam Bakar', 20000, 1, 'available'),
(3, 'Dendeng Balado', 22000, 1, 'available');

-- Insert 10 realistic orders over the last 30 days
INSERT INTO orders (id, user_id, customer_name, table_number, total_price, status, created_at) VALUES 
(1, 1, 'Budi Santoso', 5, 50000, 'paid', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 1, 'Siti Aminah', 2, 45000, 'paid', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 1, 'Andi Lala', 12, 120000, 'pending', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 1, 'Rina Herlina', 4, 75000, 'paid', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(5, 1, 'Joko Anwar', 8, 30000, 'cancelled', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(6, 1, 'Kartika Putri', 1, 95000, 'paid', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(7, 1, 'Ahmad Dhani', 6, 250000, 'paid', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(8, 1, 'Dewi Persik', 10, 85000, 'paid', DATE_SUB(NOW(), INTERVAL 22 DAY)),
(9, 1, 'Ariel Noah', 3, 110000, 'pending', DATE_SUB(NOW(), INTERVAL 0 DAY)),
(10, 1, 'Iwan Fals', 7, 42000, 'paid', DATE_SUB(NOW(), INTERVAL 28 DAY));

-- Insert related order items
INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES 
(1, 1, 2, 25000),
(2, 2, 2, 20000),
(3, 3, 5, 22000),
(4, 1, 3, 25000),
(5, 2, 1, 20000),
(6, 1, 2, 25000),
(6, 2, 2, 20000),
(7, 3, 10, 22000),
(8, 1, 1, 25000),
(8, 2, 3, 20000),
(9, 1, 4, 25000),
(10, 2, 2, 20000);
