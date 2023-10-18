import mongoose from "mongoose";
import moment from "moment";
const schema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  company: {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    name: {
      type: String,
      ref: "Company",
    },
  },
  fk_admin: {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    admin_name: {
      type: String,
    },
  },
  manualScreeningType: {
    type: String,
    default: "Quick Document Scan",
  },
  vaultid: {
    type: String,
    required: true,
  },
  doc_front_url: {
    type: String,
    required: true,
  },
  doc_back_url: {
    type: String,
    required: true,
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Number,
    required: true,
    default: () => moment().unix(),
  },
  updatedAt: {
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

export const QuickDocumentScan = mongoose.model("QuickDocumentScan", schema);
