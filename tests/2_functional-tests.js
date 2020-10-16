/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

let id1;
let id2;

suite("Functional Tests", function () {
  suite("POST /api/issues/{project} => object with issue data", function () {
    test("Every field filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
        })
        .end(function (err, res) {
          const respons = res.body;

          // we need this id later in the PUT tests
          id1 = respons._id;
          assert.equal(res.status, 200);
          assert.property(respons, "_id");
          assert.property(res.body, "created_on");
          assert.equal(respons.issue_title, "Title");
          assert.equal(respons.issue_text, "text");
          assert.equal(
            respons.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(respons.assigned_to, "Chai and Mocha");
          assert.equal(respons.status_text, "In QA");
          done();
        });
    });

    test("Required fields filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Second test",
          issue_text: "more text",
          created_by: "Functional Test - Required fields filled in",
        })
        .end((err, res) => {
          const respons = res.body;
          id2 = respons._id;

          assert.equal(res.status, 200);
          assert.property(respons, "_id");
          assert.property(res.body, "created_on");
          assert.equal(respons.issue_title, "Second test");
          assert.equal(respons.issue_text, "more text");
          assert.equal(
            respons.created_by,
            "Functional Test - Required fields filled in"
          );
          done();
        });
    });

    test("Missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "",
          issue_text: "",
          created_by: "",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, "error: missing required field(s)");
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => text", function () {
    test("No body", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, "no updated field sent");
          done();
        });
    });

    test("One field to update", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1,
          issue_text: "some new text",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, "successfully updated");
          done();
        });
    });

    test("Multiple fields to update", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1,
          issue_title: "a new title",
          issue_text: "some more new text",
          open: false,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, "successfully updated");
          done();
        });
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function () {
      test("No filter", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("One filter", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ _id: id1 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body[0].issue_text, "some more new text");
            done();
          });
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({
            assigned_to: "Chai and Mocha",
            created_by: "Functional Test - Every field filled in",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body[0].assigned_to, "Chai and Mocha");
            assert.equal(
              res.body[0].created_by,
              "Functional Test - Every field filled in"
            );
            assert.equal(res.body[0].open, true);
            done();
          });
      });
    }
  );

  suite("DELETE /api/issues/{project} => text", function () {
    test("No _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, "_id error");
          done();
        });
    });

    test("Valid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({ _id: id2 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, `deleted ${id2}`);
          done();
        });
    });
  });
});
