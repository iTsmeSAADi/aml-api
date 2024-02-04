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
    // default: "Quick Document Scan",
  },
  manualScreeningId: {
    type: Number
  },
  forensicType: {
    type: String,
  },
  review_url: {
    type: String,
  },

  vaultid: {
    type: String,
    // required: true,
  },
  doc_front_url: {
    type: String,
    // required: true,
  },
  doc_back_url: {
    type: String,
    // required: true,
  },
  doc_id: {
    type: String,
    // required: true,
  },
  
  result: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Number,
    required: true,
    default: () => moment().valueOf(), // Use moment().valueOf() to get milliseconds since the epoch
  },
  updatedAt: {
    type: Number,
    required: true,
    default: () => moment().valueOf(),
  },
});

schema.pre('save', function (next) {
  const now = moment().valueOf();
  if (this.isNew) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});

schema.pre('updateOne', function (next) {
  this.set({ updatedAt: moment().valueOf() });
  next();
});

export const QuickDocumentScan = mongoose.model("DocScansAndForensic", schema);
