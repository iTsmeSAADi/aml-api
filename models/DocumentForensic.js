import mongoose from "mongoose";
import moment from "moment";
const schema = new mongoose.Schema({
  tag: {
    type: String,
    required: false,
    default: ''
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
    default: "Document Forensics Analysis",
  },
  ocr_text: {
    type: String,
    required: false, 
    default: '',    
  },
  doc_url: {
    type: String,
    required: false,
    default: '',
  },
  documentId: {
    type: String,
    required: false,
    default: '',
  },
  // 
  ocr_text: {
    type: String,
    required: false,
    default: ''
  },
  verify_status: {
    type: Number,
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

export const DocumentForensic = mongoose.model("DocumentForensics", schema);
