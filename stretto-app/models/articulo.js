"use strict";

module.exports = function(sequelize, DataTypes) {
  var Articulo = sequelize.define("Articulo", {
    username: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    foto: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    valoracion: DataTypes.FLOAT
  }, {
    name:{singular:'Articulo', plural:'Articulos'}  
  }, {
    classMethods: {
      associate: function(models) {
        Articulo.hasMany(models.Task)
      }
    }
  });

  return Articulo;
};