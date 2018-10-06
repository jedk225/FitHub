var db = require("../models");
var passport = require("../config/passport");
var RapidAPI = require("rapidapi-connect");
var rapid = new RapidAPI(
  "default-application_5bb6e0b2e4b085e3f4087a6f",
  "fa960f0e-9c7c-4e96-9c1c-a9529be412e5"
);

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/members");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.post("/api/calcwork", function(req, res) {
    console.log(req.body);
    //Call to get a "calories burned" response from Nutritionix API
    rapid
      .call("Nutritionix", "getCaloriesBurnedForExercises", {
        applicationSecret: "1cda535374b6a8253ab9d3e5a2811c41",
        applicationId: "d93ce29b",
        exerciseDescription: req.body.userWork
      })
      .on("success", function(payload) {
        var calories = 0;
        for (var i = 0; i < payload[0].exercises.length; i++) {
          calories += Math.round(payload[0].exercises[i].nf_calories);
        }
        console.log("Activity: " + payload[0].exercises[0].name);
        console.log("Calories Burned: " + calories);
        res.json(payload);
      })
      .on("error", function() {
        console.log("Error");
      });
  });

  app.post("/api/calcfood", function(req, res) {
    console.log(req.body);
    //Call to get a "calories burned" response from Nutritionix API
    rapid
      .call("Nutritionix", "getFoodsNutrients", {
        applicationSecret: "1cda535374b6a8253ab9d3e5a2811c41",
        foodDescription: req.body.userFood,
        applicationId: "d93ce29b"
      })
      .on("success", function(payload) {
        console.log(payload);

        for (var i = 0; i < 1; i++) {
          var food = payload[i].foods[i].food_name;
          var caloriesFood = Math.round(payload[i].foods[i].nf_calories);
          var serving = payload[i].foods[i].serving_qty;

          console.log("Food: " + food);
          console.log("Calories Consumed: " + caloriesFood);
          console.log("Food Logged: " + serving + " " + food);
          // $("#food-calorie-count").text("Food Logged: " + serving + " " + food);
          // $("#food-calorie-count").append(
          //  "<p>" + "Calories Consumed: " + caloriesFood + "<p>"
        }
        res.json(payload);
      })
      .on("error", function() {
        console.log("Error");
      });
  });
};
