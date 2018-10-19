$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  var user = "";
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    user = data.email;
  });

  //update and delete data
  $(document).on("click", ".updateBurn", updateBurn);
  $(document).on("click", ".deleteBurn", deleteBurn);
  $(document).on("click", ".updateIntake", updateIntake);
  $(document).on("click", ".deleteIntake", deleteIntake);

  //update exercise
  function updateBurn() {
    var id = $(this).attr("id");
    $(".disp").html(
      "<br><br><form><div class='form-row'><div class='form-group col-md-6'><label for='inputExercise'>Exercise</label><input type='text' class='form-control' id='inputExercise' placeholder='Running'></div><div class='form-group col-md-6'><label for='inputDuration'>Duration</label><input type='text' class='form-control' id='inputDuration' placeholder='30 min'></div></div>" +
        "<button type='submit' class='alert button' id='burnSubmit'>Submit</button></form>"
    );
    $("#burnSubmit").click(function(event) {
      event.preventDefault();
      var userWork =
        $("#inputExercise")
          .val()
          .trim() +
        " for " +
        $("#inputDuration")
          .val()
          .trim();
      console.log(userWork);
      $.post("/api/updatework", {
        userWork: userWork,
        userEmail: user,
        id: id
      }).then(function(data) {
        if (data) {
          $("#burns").click();
        }
      });
    });
  }

  //delete exercise
  function deleteBurn(event) {
    event.stopPropagation();
    var id = $(this).attr("id");
    $.ajax({
      method: "DELETE",
      url: "/api/work/" + id
    }).then(function(res) {
      if (res) {
        $("#burns").click();
      }
    });
  }

  //update intake
  function updateIntake() {
    var id = $(this).attr("id");
    $(".disp").html(
      "<br><br><form><div class='form-row'><div class='form-group col-md-6'><label for='inputFood'>Food</label><input type='text' class='form-control' id='inputFood' placeholder='Lobster'></div><div class='form-group col-md-6'><label for='inputServing'>Servings</label><input type='text' class='form-control' id='inputServing' placeholder='10'></div></div>" +
        "<button type='submit' class='btn btn-warning' id='inputSubmit'>Submit</button></form>"
    );
    $("#inputSubmit").click(function(event) {
      event.preventDefault();
      var userIntake =
        $("#inputServing")
          .val()
          .trim() +
        " " +
        $("#inputFood")
          .val()
          .trim();
      console.log(userIntake);
      $.post("/api/updatefood", {
        userFood: userIntake,
        userEmail: user,
        id: id
      }).then(function(data) {
        if (data) {
          $("#intake").click();
        }
      });
    });
  }

  //delete intake
  function deleteIntake(event) {
    event.stopPropagation();
    var id = $(this).attr("id");
    $.ajax({
      method: "DELETE",
      url: "/api/food/" + id
    }).then(function(res) {
      if (res) {
        $("#intake").click();
      }
    });
  }

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
    $(".disp").html("<br><div class='container hubDisp'></div>");
    var heightCalc = (userHub.height - (userHub.height % 12)) / 12;
    $(".hubDisp").append("<h3 class='stat'>Age - " + userHub.age + "</h3>");
    $(".hubDisp").append("<h3 class='stat'>Sex - " + userHub.sex + "</h3>");
    $(".hubDisp").append(
      "<h3 class='stat'>Weight - " + userHub.weight + "lbs</h3>"
    );
    $(".hubDisp").append(
      "<h3 class='stat'>Height - " +
        heightCalc +
        "ft " +
        (userHub.height % 12) +
        "in</h3>"
    );
    $(".hubDisp").append("<h3 class='stat'>BMI - " + userHub.BMI + "</h3>");
    $(".hubDisp").append(
      "<h3 class='stat'>BMR - " + userHub.BMR + " Kcal/day</h3>"
    );
    $(".hubDisp").append("<h3 class='stat'>Goal - " + userHub.goal);

    console.log(userHub);
    var picSrc = "";
    var BMI = parseInt(userHub.BMI);
    if (BMI < 18) {
      picSrc = "skele.png";
    } else if ((18 <= BMI) & (BMI < 22)) {
      picSrc = userHub.sex + "-1.png";
    } else if ((22 <= BMI) & (BMI < 25)) {
      picSrc = userHub.sex + "-2.png";
    } else if ((25 <= BMI) & (BMI < 28)) {
      picSrc = userHub.sex + "-3.png";
    } else if ((28 <= BMI) & (BMI < 31)) {
      picSrc = userHub.sex + "-4.png";
    } else if ((31 <= BMI) & (BMI < 34)) {
      picSrc = userHub.sex + "-5.png";
    } else if (34 <= BMI) {
      picSrc = userHub.sex + "-6.png";
    }
    $(".hubDisp").append("<img src='../images/" + picSrc + "'/>");
  }

  //Hub Info Input Form
  function hubInfo() {
    $(".modal").modal("show");
    $(".healthForm").off();
    $(".healthForm").click(function(event) {
      console.log("clicked on health form");
      event.preventDefault();
      $(".disp").html(
        "<form><div class='form-row'><div class='form-group col-md-4'>" +
          "<label for='inputAge'>Age</label><input class='form-control' id='inputAge'" +
          "placeholder='35'></div><div class='form-group col-md-4'><label " +
          "for='inputSex'>Sex</label><select id='inputSex' class='form-control'><option " +
          "selected>Choose...</option><option value='male'>Male</option><option value='female'>Female</option><option value='A Lot'>A " +
          "Lot</option></select></div><div class='form-group col-md-4'>" +
          "<label for='inputWeight'>Weight (LBS)</label><input class='form-control' id='inputWeight'" +
          "placeholder='150'></div></div><label for='height'>Height</label><div class='form-row height'>" +
          "<div class='form-group col-md-3'><input class='form-control' id='inputFt'" +
          "placeholder='ft'></div><div class='form-group col-md-3'>" +
          "<input class='form-control' id='inputIn' placeholder='in'></div></div><br><br>" +
          "<label>Which of the following best describes your primary fitness goal? <select multiple id='goal'><option value='Gain Muscle'>I want to gain muscle mass</option> <option value='Lose Weight'>I want to lose weight</option> <option value='Healthy Eating'>I want to eat healthier</option> <option value='Skill Improvement'>I want to improve my sports skills (batting practice, jump shot, etc.)</option> </select> </label>" +
          "<button class='btn btn-primary btn-block'" +
          "id='userInfo'>Submit</button></form>"
      );
      $("#userInfo").off();
      $("#userInfo").click(function(click) {
        console.log("User info clicked!");
        click.preventDefault();
        var age = parseInt(
          $("#inputAge")
            .val()
            .trim()
        );
        var sex = $("#inputSex option:selected").attr("value");
        console.log(sex);
        if (sex === "A Lot") {
          sex = "male";
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
        var goal = $("#goal option:selected").val();
        console.log("Goal: " + goal);
        if (isNaN(age) || isNaN(weight) || isNaN(height)) {
          console.log("NaN");
          alert("Please provide valid input!");
        } else {
          var userInfo = {
            user: user,
            sex: sex,
            age: age,
            height: height,
            weight: weight,
            goal: goal
          };
          console.log("userInfo: " + userInfo);
          $.post("/api/health", userInfo).then(function(res) {
            if (res) {
              userHub = res;
              hubDisp();
            }
          });
        }
      });
    });
  }

  //My FitHub
  $("#hub").click(function(event) {
    event.preventDefault();
    $.get("/api/user_data").then(function(data) {
      console.log(data.email);
      console.log("clicked!");
      $.get("/api/health", { userEmail: data.email }).then(function(res) {
        if (!res) {
          hubInfo();
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
            "<tr><td class='canEdit exercise" +
              res[i].id +
              "'>" +
              res[i].exercise +
              "</td><td class='canEdit duration" +
              res[i].id +
              "'>" +
              res[i].duration +
              "</td><div></div><td>" +
              res[i].calories +
              "</td><td>" +
              moment(res[i].createdAt).format("HH:mm MM-DD-YY") +
              "</td><td><button class='updateBurn btn-sm btn-danger' id='" +
              res[i].id +
              "'>Update</button></td><td><button class='deleteBurn btn-sm btn-danger' id='" +
              res[i].id +
              "'>x</button></td></tr>"
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
            "<tr><td class='canEdit'>" +
              res[i].food +
              "</td><td class='canEdit'>" +
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
              "</td><td><button class='updateIntake btn-sm btn-danger' id='" +
              res[i].id +
              "'>Update</button></td><td><button class='deleteIntake btn-sm btn-danger' id='" +
              res[i].id +
              "'>x</button></td></tr>"
          );
        }
      });
    });
  });

  //Get Daily Calorie Summary
  $("#summary").click(function(event) {
    event.preventDefault();
    console.log("clicked!");
    var summary = {
      burn: 0,
      intake: 0,
      deficit: 0,
      surplus: 0,
      BMR: 0
    };
    $.get("/api/user_data").then(function(user) {
      $.get("/api/summary", {
        userEmail: user.email
      }).then(function(res) {
        if (!res[2]) {
          hubInfo();
          return;
        }
        summary.BMR = parseInt(res[2].BMR);
        for (i = 0; i < res[0].length; i++) {
          summary.burn += parseInt(res[0][i].calories);
        }
        for (i = 0; i < res[1].length; i++) {
          summary.intake += parseInt(res[1][i].calories);
        }
        if (summary.intake > summary.burn + summary.BMR) {
          summary.surplus = summary.intake - summary.burn - summary.BMR;
        } else {
          summary.deficit = summary.burn + summary.BMR - summary.intake;
        }

        var chartColors = {
          red: "rgb(255, 99, 132)",
          orange: "rgb(255, 159, 64)",
          yellow: "rgb(255, 205, 86)",
          green: "rgb(75, 192, 192)",
          blue: "rgb(54, 162, 235)",
          purple: "rgb(153, 102, 255)",
          grey: "rgb(231,233,237)",
          black: "rgb(255,255,255)"
        };

        //create chart
        $(".disp").html("<canvas id='myChart'></canvas>");
        var ctx = document.getElementById("myChart").getContext("2d");
        var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: "bar",

          // The data for our dataset
          data: {
            labels: ["BMR", "Burns", "Intake", "Deficit", "Surplus"],
            datasets: [
              {
                label: "My Caloric Summary",
                backgroundColor: chartColors.blue,
                borderColor: chartColors.blue,
                data: [
                  summary.BMR,
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
                  gridLines: {
                    color: chartColors.yellow
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "KCAL",
                    color: chartColors.yellow
                  },
                  ticks: {
                    fontColor: "white",
                    fontSize: 14
                  }
                }
              ],
              xAxes: [
                {
                  barThickness: 40,
                  barPercentage: true,
                  gridLines: {
                    color: chartColors.yellow
                  },
                  scaleLabel: {
                    color: chartColors.yellow
                  },
                  ticks: {
                    fontColor: "white",
                    fontSize: 16
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

  //Get Daily Macros Summary
  $("#macros").click(function(event) {
    event.preventDefault();
    console.log("clicked!");
    var macro = {
      carbs: 0,
      protein: 0,
      fat: 0,
      carbsCap: 0,
      proteinCap: 0,
      fatCap: 0,
      carbsMin: 0,
      proteinMin: 0,
      fatMin: 0
    };
    $.get("/api/user_data").then(function(user) {
      $.get("/api/summary", {
        userEmail: user.email
      }).then(function(res) {
        if (!res[2]) {
          hubInfo();
          return;
        }
        var BMR = parseInt(res[2].BMR);
        macro.carbsCap = (BMR * 0.65) / 4;
        macro.carbsMin = (BMR * 0.45) / 4;
        macro.proteinCap = (BMR * 0.35) / 4;
        macro.proteinMin = (BMR * 0.1) / 4;
        macro.fatCap = (BMR * 0.35) / 9;
        macro.fatMin = (BMR * 0.2) / 9;
        for (i = 0; i < res[1].length; i++) {
          macro.carbs += parseInt(res[1][i].carbs);
          macro.protein += parseInt(res[1][i].protein);
          macro.fat += parseInt(res[1][i].fat);
        }
        console.log(macro);
        var chartColors = {
          red: "rgb(255, 99, 132)",
          orange: "rgb(255, 159, 64)",
          yellow: "rgb(255, 205, 86)",
          green: "rgb(75, 192, 192)",
          blue: "rgb(54, 162, 235)",
          purple: "rgb(153, 102, 255)",
          grey: "rgb(231,233,237)",
          black: "rgb(255,255,255)",
          bluebg: "rgba(54, 162, 235, 0.2)",
          redbg: "rgba(255, 99, 132, 0.2)",
          yellowbg: "rgba(255, 205, 86, 0.2)"
        };

        //create chart
        $(".disp").html("<canvas id='myChart'></canvas>");
        var ctx = document.getElementById("myChart").getContext("2d");
        var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: "radar",

          // The data for our dataset
          data: {
            labels: ["Carbohydrates (g)", "Proteins (g)", "Fats(g)"],
            datasets: [
              {
                label: "My Macros Intake",
                backgroundColor: chartColors.bluebg,
                borderColor: chartColors.blue,
                data: [macro.carbs, macro.protein, macro.fat],
                fill: true
              },
              {
                label: "Macros Limit",
                backgroundColor: chartColors.redbg,
                borderColor: chartColors.red,
                data: [macro.carbsCap, macro.proteinCap, macro.fatCap],
                fill: true
              },
              {
                label: "Macros Minimum",
                backgroundColor: chartColors.yellowbg,
                borderColor: chartColors.yellow,
                data: [macro.carbsMin, macro.proteinMin, macro.fatMin],
                fill: true
              }
            ]
          },

          // Configuration options go here
          options: {
            scale: {
              pointLabels: {
                fontSize: 20,
                fontColor: "black"
              }
            },
            elements: { line: { tension: 0, borderWidth: 3 } }
          }
        });
        console.log(chart.config.data.datasets[0].label);
        //new Chart(document.getElementById("chartjs-3"),{"type":"radar","data":{"labels":["Eating","Drinking","Sleeping","Designing","Coding","Cycling","Running"]
        //,"datasets":[{"label":"My First Dataset","data":[65,59,90,81,56,55,40],"fill":true,"backgroundColor":"rgba(255, 99, 132, 0.2)","borderColor":"rgb(255, 99, 132)","pointBackgroundColor":"rgb(255, 99, 132)","pointBorderColor":"#fff","pointHoverBackgroundColor":"#fff","pointHoverBorderColor":"rgb(255, 99, 132)"},{"label":"My Second Dataset","data":[28,48,40,19,96,27,100],"fill":true,"backgroundColor":"rgba(54, 162, 235, 0.2)","borderColor":"rgb(54, 162, 235)","pointBackgroundColor":"rgb(54, 162, 235)","pointBorderColor":"#fff","pointHoverBackgroundColor":"#fff","pointHoverBorderColor":"rgb(54, 162, 235)"}]},"options":{"elements":{"line":{"tension":0,"borderWidth":3}}}});
      });
    });
  });
});
