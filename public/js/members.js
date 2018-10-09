$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });
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
      });
    });
  });

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
      });
    });
  });

  $("#burns").click(function(event) {
    event.preventDefault();
    $.get("/api/burns").then(function(data) {
      console.log("success!");
      $(".disp").html(
        "<br><br><table id='table' style='width:100%'><tr><th>Exercise</th><th>Duration (min.)</th><th>Calories Burned (KCal)</th><th>Time Logged</></tr></table>"
      );
      for (i = 0; i < data.length; i++) {
        $("#table").append(
          "<tr><td>" +
            data[i].exercise +
            "</td><td>" +
            data[i].duration +
            "</td><td>" +
            data[i].calories +
            "</td><td>" +
            moment(data[i].createdAt).format("HH:mm MM-DD-YY") +
            "</td></tr>"
        );
      }
    });
  });

  $("#intake").click(function(event) {
    event.preventDefault();
    $.get("/api/intake").then(function(data) {
      $(".disp").html(
        "<br><br><table id='table' style='width:100%'><tr><th>Food Name</th><th>Servings</th><th>Total Calories (KCal)</th><th>Time Logged</></tr></table>"
      );
      for (i = 0; i < data.length; i++) {
        $("#table").append(
          "<tr><td>" +
            data[i].food +
            "</td><td>" +
            data[i].servings +
            "</td><td>" +
            data[i].calories +
            "</td><td>" +
            moment(data[i].createdAt).format("HH:mm MM-DD-YY") +
            "</td></tr>"
        );
      }
    });
  });

  $("#summary").click(function(event) {
    event.preventDefault();
    var summary = {
      burn: 0,
      intake: 0,
      deficit: 0,
      surplus: 0
    };
    $.get("/api/summary").then(function(data) {
      console.log(data);
      for (i = 0; i < data[0].length; i++) {
        summary.burn += parseInt(data[0][i].calories);
      }
      for (i = 0; i < data[1].length; i++) {
        summary.intake += parseInt(data[1][i].calories);
      }
      if (summary.intake > summary.burn) {
        summary.surplus = summary.intake - summary.burn;
      } else {
        summary.deficit = summary.burn - summary.intake;
      }

      console.log(summary);

      //create chart on page
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
      console.log(chart.data.datasets.data);
    });
  });
});
