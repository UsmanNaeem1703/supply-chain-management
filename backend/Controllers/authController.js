const axios = require("axios");
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../Models/User");
const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/email");

// signing token, setting default time limits
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// create and send token
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// verify Captcha

exports.verifyCaptcha = catchAsync(async (req, res, next) => {
  try {
    const captcha = req.body.captcha;
    if (!captcha) {
      res.status(401).json({
        status: 'fail',
        message: 'Please Verify you are a human'
      });
      return;
    }
    const secretKey = process.env.CAPTCHA_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    // Make a request to the reCAPTCHA API
    const response = await axios.post(verifyUrl);
    const body = response.data;
    if (body.success !== undefined && !body.success) {
      return res.status(401).json({
        status: 'fail',
        message: 'Failed captcha verification'
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: "Error verifying CAPTCHA",
      error: error,
    })
  }
});

// verfify user

exports.verifyUser = async (req, res, next) => {
  const token = req.headers.authorization;

  // Decode the token
  const decodedToken = jwt.decode(token);

  // Get the user ID from the token
  const userId = decodedToken.id;

  // Fetch the user from the database
  const user = await User.findById(userId);

  // Check the 'verified' attribute
  if (user.verified) {
    res.json({ verified: true });
  } else {
    res.json({ verified: false });
  }
};

//signup function

exports.signup = async (req, res, next) => {
  try {
    // Create the new user
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    // Send the token
    createSendToken(newUser, 201, req, res);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        status: "fail",
        message: "This Email already exists",
      });
    } else {
      if (err.name === "ValidationError") {
        res.status(400).json({
          status: "fail",
          message: "Invalid Password",
        });
      } else {
        res.status(400).json({
          status: "fail",
          message: "Invalid Data",
        });
      }

      // console.log(err);
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //Check if email exists and pass exits in the request
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password!"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    // Authenticate the user
    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
      return;
    }
    createSendToken(user, 200, req, res);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        status: "fail",
        message: "This Email already exists",
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Invalid data sent",
      });
      console.log(err);
    }
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.clearCookie("role");
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not logged in! Please log in to get access." });
  }

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      message: "The user belonging to this token does no longer exist.",
    });
  }

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      message: "User recently changed password! Please log in again.",
    });
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // Check if user still exists
      const currentUser = await User.findById(decoded.id).select("+stats");
      if (!currentUser) {
        return next();
      }

      // Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // verify role
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};

//ignore the code below. will work on it at the end.

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "There is no user with this email address.",
    });
  }

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send it to user's email
  try {
    const resetURL = `${req.protocol}://localhost:3000/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "There was an error sending the email. Try again later!",
    });
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Token is invalid or has expired"
    })
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Your current password is wrong."
    });
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, req, res);
});
