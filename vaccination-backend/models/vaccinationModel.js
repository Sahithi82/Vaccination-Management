const { pool } = require("../config/db");

async function createVaccination(vaccination, connection) {
  const db = connection || pool;
  const sql = `
    INSERT INTO vaccinations (user_id, center_id, vaccine_name, vaccination_date, status)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [
    vaccination.userId,
    vaccination.centerId,
    vaccination.vaccineName,
    vaccination.vaccinationDate,
    vaccination.status || "BOOKED"
  ]);
  return result.insertId;
}

async function findVaccinationById(id) {
  const [rows] = await pool.query(
    `SELECT v.id, v.user_id, v.center_id, v.vaccine_name, v.vaccination_date, v.status,
            v.created_at, u.name AS user_name, u.email, u.phone, u.pin_code,
            c.name AS center_name, c.address, c.city, c.contact_number
     FROM vaccinations v
     JOIN users u ON u.id = v.user_id
     JOIN centers c ON c.id = v.center_id
     WHERE v.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findVaccinationsByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT v.id, v.user_id, v.center_id, v.vaccine_name, v.vaccination_date, v.status,
            v.created_at, c.name AS center_name, c.address, c.city, c.pin_code
     FROM vaccinations v
     JOIN centers c ON c.id = v.center_id
     WHERE v.user_id = ?
     ORDER BY v.id DESC`,
    [userId]
  );
  return rows;
}

async function findAllVaccinations() {
  const [rows] = await pool.query(
    `SELECT v.id, v.user_id, v.center_id, v.vaccine_name, v.vaccination_date, v.status,
            v.created_at, u.name AS user_name, u.email, c.name AS center_name
     FROM vaccinations v
     JOIN users u ON u.id = v.user_id
     JOIN centers c ON c.id = v.center_id
     ORDER BY v.id DESC`
  );
  return rows;
}

async function updateVaccinationStatus(id, status) {
  const [result] = await pool.query(
    "UPDATE vaccinations SET status = ? WHERE id = ?",
    [status, id]
  );
  return result.affectedRows;
}

async function deleteVaccination(id, connection) {
  const db = connection || pool;
  const [result] = await db.query("DELETE FROM vaccinations WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = {
  createVaccination,
  findVaccinationById,
  findVaccinationsByUserId,
  findAllVaccinations,
  updateVaccinationStatus,
  deleteVaccination
};
