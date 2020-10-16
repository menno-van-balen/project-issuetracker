/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const ObjectId = require("mongodb").ObjectID;
const { find } = require("../models/Issue");
const Issue = require("../models/Issue");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      // declare findOptions object => contains always the project name
      let findOptions = { project: req.params.project };

      // add query variables to findOptions object
      const keys = Object.keys(req.query);
      const values = Object.values(req.query);
      for (let i = 0; i < keys.length; i++) {
        findOptions[keys[i]] = values[i];
      }

      // find issues in datebase with implemented options
      Issue.find(findOptions)
        .then((docs) => {
          res.json(docs);
        })
        .catch((err) => {
          console.error(err);
        });
    })

    .post(function (req, res) {
      // variables for new issue per project
      const project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;

      if (issue_title === "" || issue_text === "" || created_by === "") {
        res.json("error: missing required field(s)");
      } else {
        // create a new issue
        const date = new Date();

        const issue = new Issue({
          _id: new ObjectId(),
          project,
          issue_title,
          issue_text,
          created_on: date,
          updated_on: date,
          created_by,
          open: true,
          assigned_to,
          status_text,
        });

        // save issue to database, respond json file if no error occured
        issue
          .save()
          .then((doc) => {
            console.log(
              "New issue with id: " + doc._id + " saved to database."
            );
            res.json(doc);
          })
          .catch((e) => {
            console.error(e);
          });
      }
    })

    .put(function (req, res) {
      // variables for update issue request
      let {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;

      // create update object for findByIdAndUpdate, values not filled in will get undefined and ommited (...only update if there is content)
      const update = {
        issue_title: (issue_title = !issue_title
          ? undefined
          : issue_title[0]
          ? issue_title
          : undefined),
        issue_text: (issue_text = !issue_text
          ? undefined
          : issue_text[0]
          ? issue_text
          : undefined),
        updated_on: new Date(),
        created_by: (created_by = !created_by
          ? undefined
          : created_by[0]
          ? created_by
          : undefined),
        assigned_to: (assigned_to = !assigned_to
          ? undefined
          : assigned_to[0]
          ? assigned_to
          : undefined),
        status_text: (status_text = !status_text
          ? undefined
          : status_text[0]
          ? status_text
          : undefined),
        open: open ? false : true,
      };

      // if no fields are sent
      if (
        update.issue_title === undefined &&
        update.issue_text === undefined &&
        update.created_by === undefined &&
        update.assigned_to === undefined &&
        update.status_text === undefined &&
        update.open === true
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
              } else {
                res.json(`deleted ${_id}`);
              }
            });
          }
        })
        .catch((err) => {
          console.error(err);
          res.json(`could not delete ${_id}`);
        });
    });
};
