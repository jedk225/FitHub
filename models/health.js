module.exports = function(sequelize, DataTypes) {
  var Health = sequelize.define("Health", {
    user: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    BMI: {
      type: DataTypes.DECIMAL
    },
    BMR: {
      type: DataTypes.DECIMAL
    }
  });
  return Health;
};
