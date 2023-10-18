import mongoose from "mongoose";
import moment from "moment";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: [6, "Password must be atleat 6 characters"],
    select: false,
  },
  company: {
    company_id: {
      ref: "Company",
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      ref: "Company",
      type: String,
    },
  },
  role: {
    type: String,
    enum: ["user", "superAdmin", "admin"],
    default: "admin",
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
  if (!this.isModified("password")) {
    return next();
  }
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  return next();
});
schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};
export const CompanyUser = mongoose.model("CompanyUser", schema);
