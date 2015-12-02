"use strict";

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var Usuario = sequelize.define("Usuario", {
    email: {
			type: DataTypes.TEXT,
			unique: true
		},
    password: {
			type: DataTypes.TEXT,
			allowNull: false
		},
    valoracion: DataTypes.FLOAT,
		nombre: {
			type: DataTypes.TEXT,
			allowNull: false
		},
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