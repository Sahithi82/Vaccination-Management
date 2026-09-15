const { pool } = require("../config/db");

async function createUser(user) {
  const sql = `
    INSERT INTO users (name, email, password, phone, pin_code)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(sql, [
    user.name,
    user.email,
    user.password,
    user.phone,
    user.pinCode
  ]);
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

async function findUserByEmailAndPassword(email, password) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0] || null;
}

async function findAllUsers() {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, pin_code, created_at FROM users ORDER BY id DESC"
  );
  return rows;
}

async function updateUser(id, user) {
  const sql = `
    UPDATE users
    SET name = ?, email = ?, password = ?, phone = ?, pin_code = ?
    WHERE id = ?
  `;
  const [result] = await pool.query(sql, [
    user.name,
    user.email,
    user.password,
    user.phone,
    user.pinCode,
    id
  ]);
  return result.affectedRows;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByEmailAndPassword,
  findUserById,
  findAllUsers,
  updateUser
};
