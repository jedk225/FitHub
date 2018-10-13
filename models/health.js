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
      type: DataTypes.FLOAT,
      allowNull: false
    },
    goal: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BMI: {
      type: DataTypes.FLOAT
    },
    BMR: {
      type: DataTypes.DECIMAL
    }
  });
  return Health;
};
