import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import errorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
//Sign Up User
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, contact, password } = req.body;
  if (!name || !email || !contact || !password)
    return next(new errorHandler("Required fields cannot be empty", 400));
  let user = await User.findOne({
    $or: [
      {
        email: email,
      },
      {
        contact: contact,
      },
    ],
  });
  if (user) return next(new errorHandler("User already exists", 409));
  user = await User.create({
    name,
    email,
    contact,
    password,
  });
  user.password = undefined; //this temporary remove the password from sending it in the response
  sendToken(
    res,
    user,
    "User Registered Successfully, Kindly wait for the response regarding your role",
    201
  );
});
//Login User
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new errorHandler("Required field cannot be empty"), 400);
  let user = await User.findOne({ email }).select("+password");
  if (!user) return next(new errorHandler("Invalid email or password", 401));
  if (user.role !== "superAdmin")
    return next(new errorHandler("User Role is not SuperAdmin", 401));
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new errorHandler("Invalid or email Password", 401));
  user.password = undefined; //this temporary remove the password from sending in the response
  sendToken(res, user, `Welcome back ${user.name}`, 200);
});
//Logout User
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User Logged Out Successfully!",
    });
});

//Change Password of super admin
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword)
    return next(new errorHandler("Required fields cannot be empty", 400));
  let { user } = req; //here the user comes after authentication (middleware)
  if (!user)
    return next(
      new errorHandler("Only Super Admin can change this profile password", 401)
    );
  user = await User.findById(user._id).select("+password");
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return next(new errorHandler("Incorrect Old Password", 401));
  if (newPassword !== confirmPassword)
    return next(
      new errorHandler("New Password and Confirm Password must be same", 401)
    );
  user.password = newPassword; // password updated
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Updated Successfully",
  });
});
