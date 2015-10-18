"use strict";

module.exports = function(sequelize, DataTypes) {
  var Tipo = sequelize.define("Tipo", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        Tipo.hasMany(models.Articulo)
      }
    }
  }, {
    name:{singular:'Tipo', plural:'Tipos'}  
  });

  return Tipo;
};