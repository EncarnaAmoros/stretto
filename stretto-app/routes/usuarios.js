var express = require('express');
var router = express.Router();
var models = require('../models');

//Comprobar autorización
var auth = require('./checkAuth');
//Variables para paginar
var paginar = require('./paginar');
//Artículos por página
var numArticulosPag = 10;
//Artículos en página del usuario
var numArticulosUsuario = 5;
//Usuarios por página
var numUsuariosPag = 15;


/* GET lista de usuarios */

router.get('/', function(pet, resp, err){
	//Buscamos en la BD
	models.Usuario.findAll({
		offset: ((pet.query.page-1)*numUsuariosPag),
		limit: numUsuariosPag,
		order: [['nombre', 'ASC']]
	}).then(function(usuarios){
		models.Usuario.count({
			order: [['nombre', 'ASC']]
		}).then(function(cantidad){
				//Obtenemos las variables para el paginado
				paginar.inicializarVariables("?page=", pet, cantidad, numUsuariosPag);
				//Si ya no hay artículos en página indicada
				if(paginar.error()==true) return resp.status(200).send("Recurso no encontrado").end();
				var self = paginar.self();
				var prev = paginar.prev();
				var next = paginar.next();
				var last = paginar.last();
				//Enviamos la respuesta con paginado
				resp.status(200).send({
					_links: {
						self: {
							href: "http://localhost:3000/stretto/usuarios"+self
						},
						first: {
							href: "http://localhost:3000/stretto/usuarios"
						},
						prev: {
							href: "http://localhost:3000/stretto/usuarios"+prev
						},
						next: {
							href: "http://localhost:3000/stretto/usuarios"+next
						},
						last: {
							href: "http://localhost:3000/stretto/usuarios"+last
						}
					},
					count: usuarios.length,
					total: cantidad,
					data: usuarios
				});
  		});
	});
});

/* GET de un usuario */
/* Cuando mostramos un usuario mostramos sus últimos 5 artículos puestos en venta. Es	*/
/* una forma de mostrar un resumen de los artículos que ha puesto en venta. Para ver	*/
/* todos sus artículos se utilizará otra petición (GET usuarios/id/articulos) 				*/

router.get('/:id', function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		return resp.status(400).send('Identificador de usuario inválido.').end();
	models.Usuario.findById(pet.params.id).then(function(usuario){
		if(usuario == undefined )
			return resp.status(404).send('No existe el usuario referido.').end();
		models.Articulo.findAll({
			where: { UsuarioId: pet.params.id },
			limit: numArticulosUsuario
		}).then(function(articulos){
			resp.status(200).send({
				data: usuario,
				articulos: articulos
			});
		});
	});
});

/* GET lista de artículos según usuario */

router.get('/:id_u/articulos', function(pet, resp){
	if(isNaN(Number(pet.params.id_u)))
		return resp.status(400).send('Identificador de usuario inválido.').end();
	models.Usuario.findById(pet.params.id_u).then(function(usuario){
		if(usuario == undefined )
			return resp.status(404).send('No existe el usuario referido.').end();
		models.Articulo.findAll({
			where: { UsuarioId: pet.params.id_u },
			offset: ((pet.query.page-1)*numArticulosPag),
			limit: numArticulosPag
		}).then(function(articulos){
			models.Articulo.count({
				where: { UsuarioId: pet.params.id_u }
			}).then(function(cantidad){
				//Obtenemos las variables para el paginado
				paginar.inicializarVariables("?page=", pet, cantidad, numArticulosPag);
				var self = paginar.self();
				var prev = paginar.prev();
				var next = paginar.next();
				var last = paginar.last();
				//Enviamos la respuesta con paginado
				resp.status(200).send({
					_links: {
						self: {
							href: "http://localhost:3000/stretto/usuarios/"+pet.params.id_u+"/articulos"+self
						},
						first: {
							href: "http://localhost:3000/stretto/usuarios/"+pet.params.id_u+"/articulos"
						},
						prev: {
							href: "http://localhost:3000/stretto/usuarios/"+pet.params.id_u+"/articulos"+prev
						},
						next: {
							href: "http://localhost:3000/stretto/usuarios/"+pet.params.id_u+"/articulos"+next
						},
						last: {
							href: "http://localhost:3000/stretto/usuarios/"+pet.params.id_u+"/articulos"+last
						}
					},
					count: articulos.length,
					total: cantidad,
					data: articulos
				});
  		});
		});
	});
});

/* POST para crear usuarios */

router.post('/', function(pet, resp){ 
	if(pet.body.email==undefined || pet.body.email=='')
		return resp.status(400).send('El email es obligatorio.').end();
	models.Usuario.create({
		email: pet.body.email,
		password: pet.body.password,
		valoracion: pet.body.valoracion,
		nombre: pet.body.nombre,
		tlf: pet.body.tlf
	}).then(function(usuario) {
			resp.location('http://localhost:3000/stretto/Usuarios/' + usuario.id);
			resp.status(201).send("Operación realizada con éxito.").end();
	}).catch(function (err) {
			//err is whatever rejected the promise chain returned to the transaction callback
			resp.status(400).send(err.message).end();
	});
});

/* PUT para actualizar usuario */

router.put('/:id', auth.checkAuth, function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		return resp.status(400).send('Identificador de usuario inválido.').end();
	models.Usuario.findById(pet.params.id).then(function(usuario){
		if(usuario == undefined )
			return resp.status(404).send('No existe el usuario referido.').end();
		if(pet.body.email==undefined || pet.body.email=='')
			return resp.status(400).send('El email es obligatorio.').end();
			models.Usuario.update({   
				email: pet.body.email,
				password: pet.body.password,
				valoracion: pet.body.valoracion,
				nombre: pet.body.nombre,
				tlf: pet.body.tlf
			}, { 
				where: {id : pet.params.id}
			}).then(function() {
					//Si ha cambiado su email o password lo eliminamos de redis
					if(usuario.email!=pet.body.email || usuario.password!=pet.body.password)
						auth.deleteAuth(usuario.email);
					resp.status(204).send("Operación realizada con éxito.").end();
			}).catch(function (err) {
					resp.status(400).send(err.message).end();
			});
	});
});

		
/* DELETE para eliminar usuarios */

router.delete('/:id', auth.checkAuth, function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		return resp.status(400).send('Identificador de usuario inválido.').end();
	models.Usuario.findById(pet.params.id).then(function(usuario){
		if(usuario == undefined )
			return resp.status(404).send('No existe el usuario referido.').end();
		models.Usuario.destroy({
				where: { id : pet.params.id }
		}).then(function() {
				resp.status(204).send("Operación realizada con éxito.");
		}).catch(function (err) {
				resp.status(400).send(err.message);
		});
	});
});

module.exports = router;
