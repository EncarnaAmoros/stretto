"use strict";

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var Articulo = sequelize.define("Articulo", {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    foto: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    valoracion: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
         Articulo.belongsTo(models.Tipo, {
          onDelete: "CASCADE",
          constraints:false,
          foreignKey: {
            allowNull: false
          }
         });
				Articulo.belongsTo(models.Usuario, {
          onDelete: "CASCADE",
          constraints:false,
          foreignKey: {
            allowNull: false
          }
         });
      }
    }
  }, {
    name:{singular:'Articulo', plural:'Articulos'}  
  });
    
  return Articulo;
};
