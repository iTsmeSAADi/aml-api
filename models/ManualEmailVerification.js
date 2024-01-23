import mongoose from "mongoose";
import moment from "moment";
import validator from "validator";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: validator.isEmail,
  },
  fk_admin: {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    admin_name: {
      type: String,
    },
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
  referenceToken: {
    webRedirectionToken: {
      type: String,
    },
    liveMobileToken: {
      type: String,
    },
  },
  completed: {
    type: Boolean,
    default: false,
  },
  manualScreeningType: {
    type: String,
    default: "Email Identity Verification",
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

export const MaunalEmailVerification = mongoose.model(
  "MaunalEmailVerification",
  schema
);
