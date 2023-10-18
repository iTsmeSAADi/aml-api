import { nanoid } from "nanoid";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Company } from "../models/Company.js";
import { CompanyUser } from "../models/CompanyUser.js";
import errorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
//Get All companies
export const getAllCompanies = catchAsyncError(async (req, res, next) => {
  const keyword = req.query.keyword || "";
  console.log(keyword);

  const companies = await Company.find({
    name: {
      $regex: keyword, //regular expressions
      $options: "i", //case - insensitve, g: match all strings.
    },
  });
  res.status(200).json({
    success: true,
    message: "all companies",
    companies,
  });
});
export const addCompany = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(new errorHandler("Comapany Name is required", 400));
  let company = await Company.findOne({ name });
  if (company) return next(new errorHandler("Company Already Exists", 409));
  company = await Company.create({
    name,
    createdBy: {
      userId: req.user._id,
      name: req.user.name,
    },
  });
  company.createdBy.userId = req.user._id;
  res.status(200).json({
    success: true,
    message: "Company Added Successfully!",
    company,
  });
});
//add new user to user management invite user
export const inviteUser = catchAsyncError(async (req, res, next) => {
  const { email, companyName, name } = req.body;
  if (!email || !companyName || !name)
    return next(new errorHandler("Required fields can not be empty", 400));
  const company = await Company.findOne({ name: companyName });
  if (!company) return next(new errorHandler("Company doesn't exist!", 404));
  let newUser = await CompanyUser.findOne({ email });
  if (newUser) return next(new errorHandler("User Already Invited!", 409));
  const randomPassword = nanoid(8);
  newUser = await CompanyUser.create({
    email,
    name,
    company: {
      company_id: company._id,
      name: company.name,
    },
    role: "admin",
    password: randomPassword,
  });
  const message = `You have been invited to verify identity in the GlobalCompliance platform by ${company.name}. Login with your email and use this password ${randomPassword} `;
  sendEmail(newUser.email, req.user.email, "Identity Verification", message);
  res.status(201).json({
    success: true,
    message: "New User Invited and Identity Verification Email is sent to user",
  });
});
//get all users from user management
export const getAllInvitedUsers = catchAsyncError(async (req, res, next) => {
  const users = await CompanyUser.find({});
  res.status(200).json({
    success: true,
    message: "All users from user management.",
    users,
  });
});
//login invited user
export const invitedUserLogin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new errorHandler("Required fields cannot be empty!", 400));
  const user = await CompanyUser.findOne({ email }).select("+password");
  if (!user)
    return next(new errorHandler("Invalid credentials, Check your email", 401));
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new errorHandler("Incorrect Password", 401));
  user.password = undefined; //this temporary remove the password from sending in the response
  sendToken(res, user, "Invited User logged In Successfully!", 200);
});
//change passsword
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  let { companyUser } = req;
  if (!companyUser)
    return next(
      new errorHandler("Only company Invited user can change the password", 401)
    );
  if (!oldPassword || !newPassword || !confirmPassword)
    return next(new errorHandler("Required fields can't be empty", 400));
  companyUser = await CompanyUser.findById(companyUser._id).select("+password");
  const isMatch = await companyUser.comparePassword(oldPassword);
  if (!isMatch) return next(new errorHandler("Incorred Old Password", 401));
  if (newPassword !== confirmPassword)
    return next(
      new errorHandler("New Password and Confirm Password must be same", 401)
    );
  companyUser.password = newPassword;
  await companyUser.save();
  return res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
});

//logoutInvidedUser
export const invitedUserLogOut = catchAsyncError(async (req, res, next) => {
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
