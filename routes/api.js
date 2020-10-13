/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var ObjectId = require("mongodb").ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const Issue = require("../models/Issue");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      var project = req.params.project;
    })

    .post(function (req, res) {
      // variable for new issue
      // var project = req.params.project;
      const _id = new ObjectId();
      const created_on = new Date();
      const open = true;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;

      // create a new issue
      const issue = new Issue({
        _id,
        issue_title,
        issue_text,
        created_on,
        created_by,
        open,
        assigned_to,
        status_text,
      });
      // console.log(issue);

      // save issue to database, respond json file if no error occured
      issue
        .save()
        .then((doc) => {
          const {
            _id,
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
          } = doc;
          console.log("New issue with id:" + _id + " saved to database.");
          res.json({
            _id,
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
          });

          // clear the form fields
          // document.getElementById("testForm").reset();
        })
        .catch((e) => {
          console.error(e);
        });
    })

    .put(function (req, res) {
      var project = req.params.project;
    })

    .delete(function (req, res) {
      var project = req.params.project;
    });
};
