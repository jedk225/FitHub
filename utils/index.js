module.exports.male = {
  BMI: function(weight, height) {
    var BMI = (weight / (height * height)) * 703;
    return BMI;
  },
  BMR: function(weight, height, age) {
    var BMR = 66 + 6.23 * weight + 12.7 * height - 6.8 * age;
    return BMR;
  },
  noActivity: function(BMR) {
    var sedMale = BMR * 1.2;
    return sedMale;
  },
  lightActivity: function(BMR) {
    var sedMale = BMR * 1.37;
    return sedMale;
  },
  moderateActivity: function(BMR) {
    var sedMale = BMR * 1.55;
    return sedMale;
  },
  veryActivite: function(BMR) {
    var sedMale = BMR * 1.725;
    return sedMale;
  },
  extremelyActivite: function(BMR) {
    var sedMale = BMR * 1.9;
    return sedMale;
  },
  IBW: function(height) {
    if (height > 60) {
      var newHeight = height - 60;
      var IBW = 110.2 + 3.5 * newHeight;
    }
    return IBW;
  }
};
module.exports.female = {
  BMI: function(weight, height) {
    var BMI = (weight / (height * height)) * 703;
    return BMI;
  },
  BMR: function(weight, height, age) {
    var BMR = 655 + 4.35 * weight + 4.7 * height - 4.7 * age;
    return BMR;
  },
  noActivity: function(BMR) {
    var sedFemale = BMR * 1.2;
    return sedFemale;
  },
  lightActivity: function(BMR) {
    var sedFemale = BMR * 1.37;
    return sedFemale;
  },
  moderateActivity: function(BMR) {
    var sedFemale = BMR * 1.55;
    return sedFemale;
  },
  veryActivite: function(BMR) {
    var sedFemale = BMR * 1.725;
    return sedFemale;
  },
  extremelyActivite: function(BMR) {
    var sedFemale = BMR * 1.9;
    return sedFemale;
  },
  IBW: function(height) {
    if (height > 60) {
      var newHeight = height - 60;
      var IBW = 110.2 + 3.5 * newHeight;
    }
    return IBW;
  }
};
