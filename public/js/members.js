$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });

  //Add Activity
  $("#workout-button").click(function(event) {
    //Prevent page from reloading
    event.preventDefault();
    $.get("/api/user_data").then(function(data) {
      var userEmail = data.email;
      //Grabs the user inputed workout from the text form
      var userWork = $("#workout-input")
        .val()
        .trim();
      $("#workout-input").val("");
      $.post("/api/calcwork", {
        userWork: userWork,
        userEmail: userEmail
      }).then(function(data) {
        $("#workDisp").html(
          "<p>You've burned " +
            data.calories +
            " calories by " +
            data.exercise +
            " for " +
            data.duration +
            " minutes!</p>"
        );
      });
    });
  });

  //Add Food
  $("#food-button").click(function(event) {
    //Prevent page from reloading
    event.preventDefault();
    $.get("/api/user_data").then(function(data) {
      var userEmail = data.email;
      //Grabs the user inputed food from the text form
      var userFood = $("#food-input")
        .val()
        .trim();
      $("#food-input").val("");
      $.post("/api/calcfood", {
        userFood: userFood,
        userEmail: userEmail
      }).then(function(data) {
        var newString = "You ate ";
        var cal = 0;
        for (i = 0; i < data.length; i++) {
          newString +=
            data[i].serving_qty + " serving(s) of " + data[i].food_name;
          cal += data[i].nf_calories;
          if (i < data.length - 1) {
            newString += " and ";
          }
        }
        newString += " for " + Math.round(cal) + " calories！";
        $("#foodDisp").html("<p>" + newString + "</p>");
      });
    });
  });

  var userHub = "";
  //Hub Display
  function hubDisp() {
    $(".disp").html("");
    console.log(userHub);
  }

  //My FitHub
  $("#hub").click(function(event) {
    event.preventDefault();
    $.get("/api/user_data").then(function(data) {
      console.log(data.email);
      $.get("/api/health", { userEmail: data.email }).then(function(res) {
        if (!res) {
          $(".modal").modal("show");
          $(".healthForm").click(function(event) {
            event.preventDefault();
            $(".disp").html(
              "<form><div class='form-row'><div class='form-group col-md-4'>" +
                "<label for='inputAge'>Age</label><input class='form-control' id='inputAge'" +
                "placeholder='35'></div><div class='form-group col-md-4'><label " +
                "for='inputSex'>Sex</label><select id='inputSex' class='form-control'><option " +
                "selected>Choose...</option><option value='Male'>Male</option><option value='Female'>Female</option><option value='A Lot'>A " +
                "Lot</option></select></div><div class='form-group col-md-4'>" +
                "<label for='inputWeight'>Weight (LBS)</label><input class='form-control' id='inputWeight'" +
                "placeholder='150'></div></div><label for='height'>Height</label><div class='form-row height'>" +
                "<div class='form-group col-md-3'><input class='form-control' id='inputFt'" +
                "placeholder='ft'></div><div class='form-group col-md-3'>" +
                "<input class='form-control' id='inputIn' placeholder='in'></div></div><br><br><button class='btn btn-primary btn-block'" +
                "id='userInfo'>Submit</button></form>"
            );
            $("#userInfo").click(function(click) {
              click.preventDefault();
              var age = parseInt(
                $("#inputAge")
                  .val()
                  .trim()
              );
              var sex = $("#inputSex option:selected").attr("value");
              console.log(sex);
              if (sex === "A Lot") {
                sex = "Male";
              }
              var weight = parseInt(
                $("#inputWeight")
                  .val()
                  .trim()
              );
              var height =
                parseInt(
                  $("#inputFt")
                    .val()
                    .trim()
                ) *
                  12 +
                parseInt(
                  $("#inputIn")
                    .val()
                    .trim()
                );
              if (isNaN(age) || isNaN(weight) || isNaN(height)) {
                console.log("NaN");
                alert("Please provide valid input!");
              } else {
                var userInfo = {
                  user: data.email,
                  sex: sex,
                  age: age,
                  height: height,
                  weight: weight
                };
                $.post("/api/health", userInfo).then(function(res) {
                  if (res) {
                    userHub = res;
                    hubDisp();
                  }
                });
              }
            });
          });
        } else {
          userHub = res;
          hubDisp();
        }
      });
    });
  });

  //Get Calorie Burns From DB
  $("#burns").click(function(event) {
    event.preventDefault();
    $.get("/api/user_data").then(function(data) {
      $.get("/api/burns", {
        userEmail: data.email
      }).then(function(res) {
        $(".disp").html(
          "<br><br><table id='table' style='width:100%'><tr><th>Exercise</th><th>Duration (min.)</th><th>Calories Burned (KCal)</th><th>Time Logged</></tr></table>"
        );
        for (i = 0; i < res.length; i++) {
          $("#table").append(
            "<tr><td>" +
              res[i].exercise +
              "</td><td>" +
              res[i].duration +
              "</td><td>" +
              res[i].calories +
              "</td><td>" +
              moment(res[i].createdAt).format("HH:mm MM-DD-YY") +
              "</td></tr>"
          );
        }
      });
    });
  });

  //Get Calorie Intake From DB
  $("#intake").click(function(event) {
    event.preventDefault();
    $.get("/api/user_data").then(function(data) {
      $.get("/api/intake", {
        userEmail: data.email
      }).then(function(res) {
        $(".disp").html(
          "<br><br><table id='table' style='width:100%'><tr><th>Food Name</th><th>Servings</th><th>Total Calories(KCal)</th><th>Carbs(g)</th><th>Protein(g)</th><th>Fat(g)</th><th>Time Logged</></tr></table>"
        );
        for (i = 0; i < res.length; i++) {
          $("#table").append(
            "<tr><td>" +
              res[i].food +
              "</td><td>" +
              res[i].servings +
              "</td><td>" +
              res[i].calories +
              "</td><td>" +
              res[i].carbs +
              "</td><td>" +
              res[i].protein +
              "</td><td>" +
              res[i].fat +
              "</td><td>" +
              moment(res[i].createdAt).format("HH:mm MM-DD-YY") +
              "</td></tr>"
          );
        }
      });
    });
  });

  //Get Daily Calorie Summary
  $("#summary").click(function(event) {
    event.preventDefault();
    var summary = {
      burn: 0,
      intake: 0,
      deficit: 0,
      surplus: 0
    };
    var macro = {
      carbs: 0,
      protein: 0,
      fat: 0
    };
    $.get("/api/user_data").then(function(user) {
      $.get("/api/summary", {
        userEmail: user.email
      }).then(function(res) {
        for (i = 0; i < res[0].length; i++) {
          summary.burn += parseInt(res[0][i].calories);
        }
        for (i = 0; i < res[1].length; i++) {
          summary.intake += parseInt(res[1][i].calories);
          macro.carbs += parseInt(res[1][i].carbs);
          macro.protein += parseInt(res[1][i].protein);
          macro.fat += parseInt(res[1][i].fat);
        }
        if (summary.intake > summary.burn) {
          summary.surplus = summary.intake - summary.burn;
        } else {
          summary.deficit = summary.burn - summary.intake;
        }

        //create chart
        $(".disp").html("<canvas id='myChart'></canvas>");
        var ctx = document.getElementById("myChart").getContext("2d");
        var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: "bar",

          // The data for our dataset
          data: {
            labels: ["Burns", "Intake", "Deficit", "Surplus"],
            datasets: [
              {
                label: "My Daily Summary",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: [
                  summary.burn,
                  summary.intake,
                  summary.deficit,
                  summary.surplus
                ]
              }
            ]
          },

          // Configuration options go here
          options: {
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: "KCAL"
                  }
                }
              ]
            }
          }
        });
        console.log(chart.config.data.datasets[0].label);
      });
    });
  });
});
