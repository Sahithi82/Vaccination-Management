const { pool } = require("../config/db");

async function createCenter(center) {
  const sql = `
    INSERT INTO centers
    (name, address, city, state, pin_code, contact_number, vaccine_name, available_slots, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(sql, [
    center.name,
    center.address,
    center.city,
    center.state,
    center.pinCode,
    center.contactNumber,
    center.vaccineName,
    center.availableSlots,
    center.status || "ACTIVE"
  ]);
  return result.insertId;
}

async function findAllCenters() {
  const [rows] = await pool.query("SELECT * FROM centers ORDER BY id DESC");
  return rows;
}

async function findCenterById(id) {
  const [rows] = await pool.query("SELECT * FROM centers WHERE id = ?", [id]);
  return rows[0] || null;
}

async function findCentersByPinCode(pinCode) {
  const [rows] = await pool.query(
    `SELECT * FROM centers
     WHERE pin_code = ? AND status = 'ACTIVE' AND available_slots > 0
     ORDER BY available_slots DESC`,
    [pinCode]
  );
  return rows;
}

async function updateCenter(id, center) {
  const sql = `
    UPDATE centers
    SET name = ?, address = ?, city = ?, state = ?, pin_code = ?,
        contact_number = ?, vaccine_name = ?, available_slots = ?, status = ?
    WHERE id = ?
  `;
  const [result] = await pool.query(sql, [
    center.name,
    center.address,
    center.city,
    center.state,
    center.pinCode,
    center.contactNumber,
    center.vaccineName,
    center.availableSlots,
    center.status,
    id
  ]);
  return result.affectedRows;
}

async function deleteCenter(id) {
  const [result] = await pool.query("DELETE FROM centers WHERE id = ?", [id]);
  return result.affectedRows;
}

async function decreaseSlots(centerId, connection) {
  const db = connection || pool;
  const [result] = await db.query(
    `UPDATE centers
     SET available_slots = available_slots - 1
     WHERE id = ? AND available_slots > 0`,
    [centerId]
  );
  return result.affectedRows;
}

async function increaseSlots(centerId, connection) {
  const db = connection || pool;
  const [result] = await db.query(
    "UPDATE centers SET available_slots = available_slots + 1 WHERE id = ?",
    [centerId]
  );
  return result.affectedRows;
}

module.exports = {
  createCenter,
  findAllCenters,
  findCenterById,
  findCentersByPinCode,
  updateCenter,
  deleteCenter,
  decreaseSlots,
  increaseSlots
};
