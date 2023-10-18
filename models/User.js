import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import moment from "moment";
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: validator.isEmail,
  },
  contact: {
    type: String,
    required: [true, "Please Enter Your Contact Number"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: [6, "Password must be atleat 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "superAdmin", "admin"],
    default: "user",
  },
  updatedAt: {
    type: Number,
    required: true,
    default: () => moment().unix(),
  },
  createdAt: {
    type: Number,
    required: true,
    default: () => moment().unix(),
  },
});
schema.pre("save", function (next) {
  if (this.isNew) {
    this.createdAt = moment().unix();
  }
  this.updatedAt = moment().unix();
  return next();
});
schema.pre("updateOne", function (next) {
  this.set({ updatedAt: moment().unix() });
  next();
});
schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
});
schema.methods.getJWTToken = function () {
  //send to utility function
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};
schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export const User = mongoose.model("User", schema);
