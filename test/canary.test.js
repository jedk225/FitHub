var expect = require("chai").expect;
var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");

describe("canary test", function() {
  // A "canary" test is one we set up to always pass
  // This can help us ensure our testing suite is set up correctly before writing real tests
  it("should pass this canary test", function() {
    expect(true).to.be.true;
  });
});

// Setting up the chai http plugin
chai.use(chaiHttp);

describe("GET /api/burns", function() {
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });
  it("should find all of the users' activites and calories burned for each", function(done) {
    db.Cal.bulkCreate([
      {
        user: "lilo10@gmail.com",
        exercise: "weightlifting",
        duration: 30,
        calories: 100
      },
      {
        user: "lilo11@gmail.com",
        exercise: "sprinting",
        duration: 30,
        calories: 300
      }
    ]).then(function() {
      request.get("/api/burns").end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;

        console.log(responseBody);

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an("array")
          .that.has.lengthOf(2);

        expect(responseBody[0])
          .to.be.an("object")
          .that.includes({
            user: "lilo10@gmail.com",
            exercise: "weightlifting",
            duration: 30,
            calories: 100
          });

        expect(responseBody[1])
          .to.be.an("object")
          .that.includes({
            user: "lilo11@gmail.com",
            exercise: "sprinting",
            duration: 30,
            calories: 300
          });

        done();
      });
    });
  });
});
