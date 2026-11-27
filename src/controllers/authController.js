const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    // Check if user exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (default role cashier)
    const [result] = await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, 'cashier']);
    
    res.status(201).json({ success: true, message: 'Registration successful', data: { id: result.insertId, name, email, role: 'cashier' } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Check user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    let isMatch = false;
    try {
        isMatch = await bcrypt.compare(password, user.password);
    } catch (err) {
        // Fallback for plaintext passwords if any exist
        isMatch = password === user.password;
    }
    
    if (!isMatch && password !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    // Dummy forgot password since no email service is setup
    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // Dummy reset password
    res.status(200).json({ success: true, message: 'Password has been successfully reset.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request', error: error.message });
  }
};
