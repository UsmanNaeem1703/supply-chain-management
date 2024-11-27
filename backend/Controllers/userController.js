const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const getuserbyId = async (req, res) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "Failed",
        message: "Token must be provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    // Find the user and the cart item with the given product

    const user = await User.findById(userId);
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    // Retrieve page number and limit from query parameters with defaults
    const page = parseInt(req.query.page, 10) || 1; // Fixed to use query parameter
    const limit = 50; // Default to 50 items per page as specified
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit);

    // Optionally, return the total count of users for client-side pagination
    const total = await User.countDocuments();

    res.json({
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getuserbyId,
  getAllUsers
};
