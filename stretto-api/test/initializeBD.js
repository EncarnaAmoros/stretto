var express = require('express');
var models = require('../models');
var app = require('../app');
var debug = require('debug')('.bin:server');

//Inicializa la BD creando usuarios, tipos y artículos para los test
exports.initialize = function() {
	return models.sequelize.sync({force:true}).then(function () {
		/* Rellenando BD */
		models.Tipo.bulkCreate([
			{nombre:'cuerda'},
			{nombre:'viento'},
			{nombre:'percusion'}
		]).then(function() {
				models.Usuario.bulkCreate([
					{id: 1, nombre:'Lucas', email: 'lucas@gm.com', password: 'l', 
							valoracion: 8, tlf: '665372812'},
					{id: 2, nombre:'Ana', email: 'ana@gm.com', password: 'a', 
							valoracion: 9, tlf: '665372812'},
					{id: 3, nombre:'Juan', email: 'juan@gm.com', password: 'j', 
							valoracion: 10, tlf: '665372812'}
				]).then(function() {
						models.Articulo.bulkCreate([
						{
							nombre:'Guitarra', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'cuerda',
							UsuarioId: 1
						}, {
							nombre:'Bajo', 
							descripcion: 'El mejor bajo que puedas ver',
							foto: 'www.url.com',
							precio: 174.65,
							TipoNombre: 'cuerda',
							UsuarioId: 2
						}, {
							nombre:'Saxofon', 
							descripcion: 'El mejor saxo que puedas ver',
							foto: 'www.url.com',
							precio: 334.65,
							TipoNombre: 'viento',
							UsuarioId: 1
						}, {
							nombre:'Bateria', 
							descripcion: 'La mejor bateria que puedas ver',
							foto: 'www.url.com',
							precio: 934.65,
							TipoNombre: 'percusion',
							UsuarioId: 3
					}, {
							nombre:'Flauta', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'viento',
							UsuarioId: 2
						}, {
							nombre:'Oboe', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'viento',
							UsuarioId: 3
						}, {
							nombre:'Violonchelo', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'cuerda',
							UsuarioId: 1
						}, {
							nombre:'Violin', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'cuerda',
							UsuarioId: 2
						}, {
							nombre:'Baquetas', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'percusion',
							UsuarioId: 1
						}, {
							nombre:'Maracas', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'percusion',
							UsuarioId: 1
						}, {
							nombre:'Caja', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'percusion',
							UsuarioId: 1
						}, {
							nombre:'Bandurria', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'cuerda',
							UsuarioId: 2
						}, {
							nombre:'Flauta', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'viento',
							UsuarioId: 2
						}, {
							nombre:'Oboe', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'viento',
							UsuarioId: 3
						}, {
							nombre:'Violonchelo', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'cuerda',
							UsuarioId: 1
						}, {
							nombre:'Violin', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'cuerda',
							UsuarioId: 2
						}, {
							nombre:'Baquetas', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'percusion',
							UsuarioId: 1
						}, {
							nombre:'Maracas', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'percusion',
							UsuarioId: 1
						}, {
							nombre:'Caja', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'percusion',
							UsuarioId: 1
						}, {
							nombre:'Bandurria', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'cuerda',
							UsuarioId: 2
						}, {
							nombre:'Ukelele', 
							descripcion: 'La mejor guitarra que puedas ver',
							foto: 'www.url.com',
							precio: 134.65,
							TipoNombre: 'cuerda',
							UsuarioId: 1
						}]);
				});
		});
	});
}

