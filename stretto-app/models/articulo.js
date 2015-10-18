"use strict";

module.exports = function(sequelize, DataTypes) {
  var Articulo = sequelize.define("Articulo", {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    foto: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    valoracion: DataTypes.FLOAT
  }, {
    name:{singular:'Articulo', plural:'Articulos'}  
  }, {
    classMethods: {
      associate: function(models) {
        Articulo.belongsTo(models.Tipo)
      }
    }
  });

  return Articulo;
};