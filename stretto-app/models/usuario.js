"use strict";

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var Usuario = sequelize.define("Usuario", {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    valoracion: DataTypes.FLOAT,
    nombre: DataTypes.TEXT,
    tlf: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
         Usuario.hasMany(models.Articulo)
				 Usuario.belongsToMany(models.Articulo , {through: 'UsuarioArticulo'});
      }
    }
  }, {
    name:{singular:'Usuario', plural:'Usuarios'}  
  });
    
  return Usuario;
};