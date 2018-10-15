var db = require("../models");
var passport = require("../config/passport");
var RapidAPI = require("rapidapi-connect");
var health = require("../utils/index");
var rapid = new RapidAPI(
  "default-application_5bb6e0b2e4b085e3f4087a6f",
  "fa960f0e-9c7c-4e96-9c1c-a9529be412e5"
);

module.exports = function(app) {
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
        res.status(422).json(err.errors[0].message);
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

  // Route for getting user health profile
  app.get("/api/health", function(req, res) {
    db.Health.findOne({
      where: { user: req.query.userEmail }
    })
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        console.log(err);
        res.json(false);
      });
  });

  // Route for posting new user health profile
  app.post("/api/health", function(req, res) {
    console.log("health: ", health);
    console.log("Posted to API/health");
    var bmiVal;
    var bmrVal;
    if (req.body.sex === "male") {
      bmiVal = Math.round(health.male.BMI(req.body.weight, req.body.height));
      bmrVal = Math.round(
        health.male.BMR(req.body.weight, req.body.height, req.body.age)
      );
    } else {
      bmiVal = Math.round(health.female.BMI(req.body.weight, req.body.height));
      bmrVal = Math.round(
        health.female.BMR(req.body.weight, req.body.height, req.body.age)
      );
    }
    console.log("BMI is : " + bmiVal);
    console.log("BMR is : " + bmrVal);
    db.Health.create({
      user: req.body.user,
      sex: req.body.sex,
      age: req.body.age,
      height: req.body.height,
      weight: req.body.weight,
      goal: req.body.goal,
      BMI: bmiVal,
      BMR: bmrVal
    }).then(function(data) {
      res.json(data);
    });
  });

  app.get("/api/burns", function(req, res) {
    db.Cal.findAll({
      order: [["createdAt", "DESC"]],
      where: { user: req.query.userEmail }
    }).then(function(result) {
      res.json(result);
    });
  });

  app.get("/api/intake", function(req, res) {
    db.Food.findAll({
      order: [["createdAt", "DESC"]],
      where: { user: req.query.userEmail }
    }).then(function(result) {
      res.json(result);
    });
  });

  app.get("/api/summary", function(req, res) {
    var summary = [];
    db.Cal.findAll({ where: { user: req.query.userEmail } }).then(function(
      calres
    ) {
      summary.push(calres);
      db.Food.findAll({ where: { user: req.query.userEmail } }).then(function(
        foodres
      ) {
        summary.push(foodres);
        db.Health.findOne({ where: { user: req.query.userEmail } })
          .then(function(healthres) {
            summary.push(healthres);
          })
          .then(function() {
            res.json(summary);
          });
      });
    });
  });

  //calculate workout
  app.post("/api/calcwork", function(req, res) {
    //Call to get a "calories burned" response from Nutritionix API
    rapid
      .call("Nutritionix", "getCaloriesBurnedForExercises", {
        applicationSecret: process.env.applicationSecret,
        applicationId: process.env.applicationId,
        exerciseDescription: req.body.userWork
      })
      .on("success", function(payload) {
        var calories = 0;
        var duration = 0;
        for (var i = 0; i < payload[0].exercises.length; i++) {
          calories += Math.round(payload[0].exercises[i].nf_calories);
          duration += Math.round(payload[0].exercises[i].duration_min);
        }

        if (req.body.userEmail) {
          db.Cal.create({
            user: req.body.userEmail,
            exercise: payload[0].exercises[0].name,
            duration: duration,
            calories: calories
          }).then(function(dbCal) {
            res.json(dbCal);
          });
        }
      })
      .on("error", function() {
        console.log("Error");
      });
  });

  //update workout
  app.post("/api/updatework", function(req, res) {
    //Call to get a "calories burned" response from Nutritionix API
    rapid
      .call("Nutritionix", "getCaloriesBurnedForExercises", {
        applicationSecret: "1cda535374b6a8253ab9d3e5a2811c41",
        applicationId: "d93ce29b",
        exerciseDescription: req.body.userWork
      })
      .on("success", function(payload) {
        var calories = 0;
        var duration = 0;
        for (var i = 0; i < payload[0].exercises.length; i++) {
          calories += Math.round(payload[0].exercises[i].nf_calories);
          duration += Math.round(payload[0].exercises[i].duration_min);
        }

        if (req.body.userEmail) {
          db.Cal.update(
            {
              exercise: payload[0].exercises[0].name,
              duration: duration,
              calories: calories
            },
            {
              where: {
                id: req.body.id
              }
            }
          ).then(function(dbCal) {
            res.json(dbCal);
          });
        }
      })
      .on("error", function() {
        console.log("Error");
      });
  });

  //delete workout
  app.delete("/api/work/:id", function(req, res) {
    db.Cal.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
      res.json(result);
    });
  });

  //calculate food
  app.post("/api/calcfood", function(req, res) {
    //Call to get a "calories consumed" response from Nutritionix API
    rapid
      .call("Nutritionix", "getFoodsNutrients", {
        applicationSecret: process.env.applicationSecret,
        foodDescription: req.body.userFood,
        applicationId: process.env.applicationId
      })
      .on("success", function(payload) {
        for (var i = 0; i < payload[0].foods.length; i++) {
          console.log(payload[0].foods[i]);
          var food = payload[0].foods[i].food_name;
          var caloriesFood = Math.round(payload[0].foods[i].nf_calories);
          var serving = payload[0].foods[i].serving_qty;

          // Macros (Carbs, Protein, and Fat) in grams
          var carbs = Math.round(payload[0].foods[i].nf_total_carbohydrate);
          var proteins = Math.round(payload[0].foods[i].nf_protein);
          var fat = Math.round(payload[0].foods[i].nf_total_fat);

          if (req.body.userEmail) {
            db.Food.create({
              user: req.body.userEmail,
              food: food,
              servings: serving,
              calories: caloriesFood,
              carbs: carbs,
              protein: proteins,
              fat: fat
            });
          }
        }
        res.send(payload[0].foods);
      })
      .on("error", function() {
        console.log("Error");
      });
  });

  //update food
  app.post("/api/updatefood", function(req, res) {
    //Call to get a "calories consumed" response from Nutritionix API
    rapid
      .call("Nutritionix", "getFoodsNutrients", {
        applicationSecret: "1cda535374b6a8253ab9d3e5a2811c41",
        foodDescription: req.body.userFood,
        applicationId: "d93ce29b"
      })
      .on("success", function(payload) {
        for (var i = 0; i < payload[0].foods.length; i++) {
          console.log(payload[0].foods[i]);
          var food = payload[0].foods[i].food_name;
          var caloriesFood = Math.round(payload[0].foods[i].nf_calories);
          var serving = payload[0].foods[i].serving_qty;

          // Macros (Carbs, Protein, and Fat) in grams
          var carbs = Math.round(payload[0].foods[i].nf_total_carbohydrate);
          var proteins = Math.round(payload[0].foods[i].nf_protein);
          var fat = Math.round(payload[0].foods[i].nf_total_fat);

          if (req.body.userEmail) {
            db.Food.update(
              {
                food: food,
                servings: serving,
                calories: caloriesFood,
                carbs: carbs,
                protein: proteins,
                fat: fat
              },
              {
                where: {
                  id: req.body.id
                }
              }
            );
          }
        }
        res.send(payload[0].foods);
      })
      .on("error", function() {
        console.log("Error");
      });
  });

  //delete food intake
  app.delete("/api/food/:id", function(req, res) {
    db.Food.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
      res.json(result);
    });
  });
};
