import mongoose from "mongoose";
import moment from "moment";
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Company Name"],
  },
  createdBy: {
    userId: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      ref: "User",
      type: String,
    },
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
export const Company = mongoose.model("companies", schema);
