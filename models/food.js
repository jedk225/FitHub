module.exports = function(sequelize, DataTypes) {
  var Food = sequelize.define("Food", {
    user: DataTypes.STRING,
    food: DataTypes.STRING,
    servings: DataTypes.INTEGER,
    calories: DataTypes.INTEGER,
    carbs: DataTypes.INTEGER,
    protein: DataTypes.INTEGER,
    fat: DataTypes.INTEGER
  });
  return Food;
};
