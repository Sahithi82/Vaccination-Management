const userModel = require("../models/userModel");

function toUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    pinCode: user.pin_code
  };
}

async function register(req, res) {
  try {
    const { name, email, password, phone, pinCode } = req.body;

    if (!name || !email || !password || !phone || !pinCode) {
      return res.status(400).json({
        success: false,
        message: "name, email, password, phone, and pinCode are required"
      });
    }

    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered"
      });
    }

    const id = await userModel.createUser({
      name,
      email,
      password,
      phone,
      pinCode
    });

    const user = await userModel.findUserById(id);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: toUserResponse(user)
    });
  } catch (error) {
    console.error("register error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to register user"
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required"
      });
    }

    const user = await userModel.findUserByEmailAndPassword(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user credentials"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User login successful",
      data: toUserResponse(user)
    });
  } catch (error) {
    console.error("login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to login user"
    });
  }
}

async function getUserById(req, res) {
  try {
    const user = await userModel.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched",
      data: toUserResponse(user)
    });
  } catch (error) {
    console.error("getUserById error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user"
    });
  }
}

async function updateUser(req, res) {
  try {
    const existing = await userModel.findUserById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const { name, email, password, phone, pinCode } = req.body;

    await userModel.updateUser(req.params.id, {
      name: name || existing.name,
      email: email || existing.email,
      password: password || existing.password,
      phone: phone || existing.phone,
      pinCode: pinCode || existing.pin_code
    });

    const user = await userModel.findUserById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "User updated",
      data: toUserResponse(user)
    });
  } catch (error) {
    console.error("updateUser error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update user"
    });
  }
}

module.exports = {
  register,
  login,
  getUserById,
  updateUser
};
