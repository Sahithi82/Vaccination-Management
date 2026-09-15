const { pool } = require("../config/db");
const userModel = require("../models/userModel");
const centerModel = require("../models/centerModel");
const vaccinationModel = require("../models/vaccinationModel");

async function getCenters(req, res) {
  try {
    const { pinCode } = req.query;
    const centers = pinCode
      ? await centerModel.findCentersByPinCode(pinCode)
      : await centerModel.findAllCenters();

    return res.status(200).json({
      success: true,
      message: "Vaccination centers fetched",
      data: centers
    });
  } catch (error) {
    console.error("getCenters error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch vaccination centers"
    });
  }
}

async function getCenterById(req, res) {
  try {
    const center = await centerModel.findCenterById(req.params.id);
    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Vaccination center not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vaccination center fetched",
      data: center
    });
  } catch (error) {
    console.error("getCenterById error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch vaccination center"
    });
  }
}

async function bookVaccination(req, res) {
  const connection = await pool.getConnection();
  try {
    const { userId, vaccinationDate } = req.body;

    if (!userId || !vaccinationDate) {
      return res.status(400).json({
        success: false,
        message: "userId and vaccinationDate are required"
      });
    }

    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const centers = await centerModel.findCentersByPinCode(user.pin_code);
    if (centers.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No vaccination center available for PIN Code ${user.pin_code}`
      });
    }

    const center = centers[0];

    await connection.beginTransaction();

    const decreased = await centerModel.decreaseSlots(center.id, connection);
    if (!decreased) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: "No slots available at the selected vaccination center"
      });
    }

    const vaccinationId = await vaccinationModel.createVaccination(
      {
        userId: user.id,
        centerId: center.id,
        vaccineName: center.vaccine_name,
        vaccinationDate,
        status: "BOOKED"
      },
      connection
    );

    await connection.commit();

    const vaccination = await vaccinationModel.findVaccinationById(vaccinationId);
    return res.status(201).json({
      success: true,
      message: "Vaccination booked successfully",
      data: vaccination
    });
  } catch (error) {
    await connection.rollback();
    console.error("bookVaccination error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to book vaccination"
    });
  } finally {
    connection.release();
  }
}

async function getVaccinationById(req, res) {
  try {
    const vaccination = await vaccinationModel.findVaccinationById(req.params.id);
    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: "Vaccination record not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vaccination record fetched",
      data: vaccination
    });
  } catch (error) {
    console.error("getVaccinationById error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch vaccination record"
    });
  }
}

async function getVaccinationsByUser(req, res) {
  try {
    const user = await userModel.findUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const vaccinations = await vaccinationModel.findVaccinationsByUserId(req.params.userId);
    return res.status(200).json({
      success: true,
      message: "User vaccinations fetched",
      data: vaccinations
    });
  } catch (error) {
    console.error("getVaccinationsByUser error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user vaccinations"
    });
  }
}

async function updateVaccinationStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ["BOOKED", "COMPLETED", "CANCELLED"];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be BOOKED, COMPLETED, or CANCELLED"
      });
    }

    const existing = await vaccinationModel.findVaccinationById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Vaccination record not found"
      });
    }

    await vaccinationModel.updateVaccinationStatus(req.params.id, status);
    const vaccination = await vaccinationModel.findVaccinationById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Vaccination status updated",
      data: vaccination
    });
  } catch (error) {
    console.error("updateVaccinationStatus error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update vaccination status"
    });
  }
}

async function cancelVaccination(req, res) {
  const connection = await pool.getConnection();
  try {
    const existing = await vaccinationModel.findVaccinationById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Vaccination record not found"
      });
    }

    await connection.beginTransaction();
    await vaccinationModel.deleteVaccination(req.params.id, connection);
    if (existing.status === "BOOKED") {
      await centerModel.increaseSlots(existing.center_id, connection);
    }
    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Vaccination cancelled"
    });
  } catch (error) {
    await connection.rollback();
    console.error("cancelVaccination error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to cancel vaccination"
    });
  } finally {
    connection.release();
  }
}

module.exports = {
  getCenters,
  getCenterById,
  bookVaccination,
  getVaccinationById,
  getVaccinationsByUser,
  updateVaccinationStatus,
  cancelVaccination
};
