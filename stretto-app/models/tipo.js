"use strict";

module.exports = function(sequelize, DataTypes) {
  var Tipo = sequelize.define("Tipo", {
    nombre: DataTypes.STRING,
  }, {
    name:{singular:'Tipo', plural:'Tipos'}  
  }, {
    classMethods: {
      associate: function(models) {
        Tipos.hasMany(models.Articulo)
      }
    }
  });

  return Tipo;
};