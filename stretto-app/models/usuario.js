"use strict";

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var Usuario = sequelize.define("Usuario", {
    email: {
			type: DataTypes.TEXT,
			unique: true
		},
    password: DataTypes.TEXT,
    valoracion: DataTypes.FLOAT,
    nombre: DataTypes.TEXT,
    tlf: DataTypes.INTEGER
  }, {
		name:{singular:'Usuario', plural:'Usuarios'},
    classMethods: {
      associate: function(models) {
         Usuario.hasMany(models.Articulo);
				 Usuario.belongsToMany(models.Articulo , {through: 'UsuarioArticulo'});
      }
    }
  });
    
  return Usuario;
};