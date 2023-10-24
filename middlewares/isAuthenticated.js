import { CompanyUser } from "../models/CompanyUser.js";
import { User } from "../models/User.js";
import errorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.headers.token;
  console.log(token);
  if (!token) return next(new errorHandler("User Not Logged In", 401));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id);
  if (!user)
    return next(new errorHandler("User does not exist", 404)); //404 user not found.
  req.user = user;
  next();
});
