const mongoose = require("mongoose");

const schema = mongoose.Schema;

const issueSchema = new schema({
  _id: { type: String, required: true },
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, required: true },
  updated_on: { type: Date },
  created_by: { type: String, required: true },
  open: { type: Boolean },
  assigned_to: { type: String },
  status_text: { type: String },
});

const Issue = mongoose.model("issue", issueSchema);

module.exports = Issue;
