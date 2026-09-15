const centerModel = require("../models/centerModel");
const userModel = require("../models/userModel");
const vaccinationModel = require("../models/vaccinationModel");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Nimda";

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true,
      message: "Admin login successful"
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid admin credentials"
  });
}

async function createCenter(req, res) {
  try {
    const {
      name,
      address,
      city,
      state,
      pinCode,
      contactNumber,
      vaccineName,
      availableSlots,
      status
    } = req.body;

    if (!name || !address || !city || !state || !pinCode || !contactNumber || !vaccineName) {
      return res.status(400).json({
        success: false,
        message: "All center fields are required"
      });
    }

    if (availableSlots === undefined || availableSlots < 0) {
      return res.status(400).json({
        success: false,
        message: "availableSlots must be 0 or more"
      });
    }

    const id = await centerModel.createCenter({
      name,
      address,
      city,
      state,
      pinCode,
      contactNumber,
      vaccineName,
      availableSlots,
      status
    });

    const center = await centerModel.findCenterById(id);
    return res.status(201).json({
      success: true,
      message: "Vaccination center created",
      data: center
    });
  } catch (error) {
    console.error("createCenter error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create vaccination center"
    });
  }
}

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

async function updateCenter(req, res) {
  try {
    const existing = await centerModel.findCenterById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Vaccination center not found"
      });
    }

    const {
      name,
      address,
      city,
      state,
      pinCode,
      contactNumber,
      vaccineName,
      availableSlots,
      status
    } = req.body;

    if (availableSlots !== undefined && availableSlots < 0) {
      return res.status(400).json({
        success: false,
        message: "availableSlots must be 0 or more"
      });
    }

    await centerModel.updateCenter(req.params.id, {
      name: name || existing.name,
      address: address || existing.address,
      city: city || existing.city,
      state: state || existing.state,
      pinCode: pinCode || existing.pin_code,
      contactNumber: contactNumber || existing.contact_number,
      vaccineName: vaccineName || existing.vaccine_name,
      availableSlots: availableSlots !== undefined ? availableSlots : existing.available_slots,
      status: status || existing.status
    });

    const center = await centerModel.findCenterById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Vaccination center updated",
      data: center
    });
  } catch (error) {
    console.error("updateCenter error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update vaccination center"
    });
  }
}

async function deleteCenter(req, res) {
  try {
    const existing = await centerModel.findCenterById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Vaccination center not found"
      });
    }

    await centerModel.deleteCenter(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Vaccination center deleted"
    });
  } catch (error) {
    console.error("deleteCenter error:", error.message);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "Cannot delete center because vaccinations are linked to it"
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unable to delete vaccination center"
    });
  }
}

async function getUsers(req, res) {
  try {
    const users = await userModel.findAllUsers();
    return res.status(200).json({
      success: true,
      message: "Users fetched",
      data: users
    });
  } catch (error) {
    console.error("getUsers error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch users"
    });
  }
}

async function getVaccinations(req, res) {
  try {
    const vaccinations = await vaccinationModel.findAllVaccinations();
    return res.status(200).json({
      success: true,
      message: "Vaccinations fetched",
      data: vaccinations
    });
  } catch (error) {
    console.error("getVaccinations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch vaccinations"
    });
  }
}

module.exports = {
  login,
  createCenter,
  getCenters,
  getCenterById,
  updateCenter,
  deleteCenter,
  getUsers,
  getVaccinations
};
