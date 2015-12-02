"use strict";

var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var Articulo = sequelize.define("Articulo", {
		nombre: {
			allowNull: false,
			type: DataTypes.STRING			
		},
    descripcion: DataTypes.TEXT,
    foto: DataTypes.STRING,
		precio: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
    valoracion: DataTypes.FLOAT
  }, {
		name:{singular:'Articulo', plural:'Articulos'},
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
				Articulo.belongsToMany(models.Usuario, {through: 'UsuarioArticulo'});
      }
    }
  });
    
  return Articulo;
};
