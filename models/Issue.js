const mongoose = require("mongoose");

const schema = mongoose.Schema;

const issueSchema = new schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date },
  updated_on: { type: Date },
  created_by: { type: String, required: true },
  open: { type: Boolean },
  status_text: { type: String },
});

const Issue = mongoose.model("issue", issueSchema);

module.exports = Issue;
