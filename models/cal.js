module.exports = function(sequelize, DataTypes) {
  var Cal = sequelize.define("Cal", {
    user: DataTypes.STRING,
    exercise: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    calories: DataTypes.INTEGER
  });
  return Cal;
};
