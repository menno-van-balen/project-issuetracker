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
      console.log(req.params);
      console.log(req.query);
      //  possible variables in query
      const {
        _id,
        issue_title,
        issue_text,
        created_on,
        created_by,
        open,
        assigned_to,
        status_text,
      } = req.query;
      console.log(open, assigned_to);
    })

    .post(function (req, res) {
      // variables for new issue
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;

      // create a new issue
      const issue = new Issue({
        _id: new ObjectId(),
        issue_title,
        issue_text,
        created_on: new Date(),
        created_by,
        open: true,
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
        })
        .catch((e) => {
          console.error(e);
        });
    })

    .put(function (req, res) {
      // variables for update issue request
      let {
        _id,
        issue_title,
        issue_text,
        created_by,
        status_text,
        open,
      } = req.body;

      // create update object, values not filled in will get undefined and ommited (only update if there is content)
      const update = {
        issue_title: (issue_title = issue_title[0] ? issue_title : undefined),
        issue_text: (issue_text = issue_text[0] ? issue_text : undefined),
        updated_on: new Date(),
        created_by: (created_by = created_by[0] ? created_by : undefined),
        status_text: (status_text = status_text[0] ? status_text : undefined),
        open: open ? false : true,
      };

      // if no fields are sent
      if (
        issue_title === undefined &&
        issue_text === undefined &&
        created_by === undefined &&
        status_text === undefined &&
        open === true
      ) {
        res.json("no updated field sent");
      } else {
        // only if id is in database update the issue
        Issue.findById(_id)
          .then((doc) => {
            if (doc === null) {
              res.json(`could not update ${_id}`);
            } else {
              Issue.findByIdAndUpdate(
                _id,
                update,
                { new: true, omitUndefined: true },
                (err, doc) => {
                  if (err) {
                    console.error(er);
                    res.json(`could not update ${_id}`);
                  } else {
                    res.json("successfully updated");
                  }
                }
              );
            }
          })
          .catch((err) => {
            console.error(err);
            res.json(`could not update ${_id}`);
          });
      }
    })

    .delete(function (req, res) {
      const _id = req.body._id;

      Issue.findById(_id)
        .then((doc) => {
          if (doc === null) {
            res.json(`_id error`);
          } else {
            Issue.deleteOne({ _id }, (err) => {
              if (err) {
                console.error(err);
                res.json(`could not delete ${_id}`);
              }
              res.json(`deleted ${_id}`);
            });
          }
        })
        .catch((err) => {
          console.error(err);
          res.json(`could not delete ${_id}`);
        });
    });
};
