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
var numArticulosUsuario = 6;
//Usuarios por página
var numUsuariosPag = 15;


/* Comprobamos si un usuario existe email password */

router.get('/login', function(pet, resp){
	var correo = pet.query.email;
	var pass = pet.query.password;
	models.Usuario.findOne({ 
		where: {email: correo, password: pass }
	}).then(function(usuario){
		if(usuario == undefined )
			return resp.status(403).send('Email o contraseña incorrectos.').end();
		else
			resp.status(200).send({mensaje: 'Inicio de sesión correcto', id: usuario.id, nombre: usuario.nombre}).end();
	});
});


/* GET lista de usuarios */

router.get('/', function(pet, resp, err){
	if(pet.query.page==undefined && pet.url!="/")
		return resp.status(400).send("Falta el parámetro page en la petición").end();
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
				var url = "http://localhost:3000/stretto/usuarios";
				var partevariable = "?page=";
				paginar.inicializarVariables(url, partevariable, pet, cantidad, numUsuariosPag);
				//Si ya no hay artículos en página indicada
				if(paginar.error()==true) return resp.status(404).send("Recurso no encontrado").end();
				var self = paginar.self();
				var prev = paginar.prev();
				var next = paginar.next();
				var last = paginar.last();
				//Enviamos la respuesta con paginado
				resp.status(200).send({
					_links: {
						self: {
							href: self
						},
						first: {
							href: url
						},
						prev: {
							href: prev
						},
						next: {
							href: next
						},
						last: {
							href: last
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
/* Cuando mostramos un usuario mostramos sus últimos 6 artículos puestos en venta. Es	*/
/* una forma de mostrar un resumen de los artículos que ha puesto en venta. Para ver	*/
/* todos sus artículos se utilizará otra petición (GET usuarios/id/articulos) 				*/
/* Incluimos toda la información de esos artículos puestos en venta más recientes			*/

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
	if(pet.query.page==undefined && pet.url!="/"+pet.params.id_u+"/articulos")
		return resp.status(400).send("Falta el parámetro page en la petición").end();
	if(isNaN(Number(pet.params.id_u)))
		return resp.status(400).send('Identificador de usuario inválido.').end();
	models.Usuario.findById(pet.params.id_u).then(function(usuario){
		if(usuario == undefined )
			return resp.status(404).send('No existe el usuario referido.').end();
		//Buscamos en la BD y devolvemos el resultado paginado
		models.Articulo.findAll({
			where: { UsuarioId: pet.params.id_u },
			offset: ((pet.query.page-1)*numArticulosPag),
			limit: numArticulosPag,
			order: 'id DESC'
		}).then(function(articulos){
			models.Articulo.count({
				where: { UsuarioId: pet.params.id_u }
			}).then(function(cantidad){
				//Obtenemos las variables para el paginado
				var url = "http://localhost:3000/stretto/usuarios/"+pet.params.id_u+"/articulos";
				var partevariable = "?page=";
				paginar.inicializarVariables(url, partevariable, pet, cantidad, numArticulosPag);
				//Si ya no hay artículos en página indicada
				if(paginar.error()==true) return resp.status(404).send("Recurso no encontrado").end();
				var self = paginar.self();
				var prev = paginar.prev();
				var next = paginar.next();
				var last = paginar.last();
				//Enviamos la respuesta con paginado
				resp.status(200).send({
					_links: {
						self: {
							href: self
						},
						first: {
							href: url
						},
						prev: {
							href: prev
						},
						next: {
							href: next
						},
						last: {
							href: last
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
	if(pet.body.nombre==undefined || pet.body.nombre=='')
		return resp.status(400).send('El nombre es obligatorio.').end();
	if(pet.body.password==undefined || pet.body.password=='')
		return resp.status(400).send('La contraseña es obligatoria.').end();
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
			if(err.message=="Validation error")
				return resp.status(400).send("Ya hay un usuario con este email.").end();
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
		if(pet.body.nombre==undefined || pet.body.nombre=='')
			return resp.status(400).send('El nombre es obligatorio.').end();
		if(pet.body.password==undefined || pet.body.password=='')
			return resp.status(400).send('La contraseña es obligatoria.').end();
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
					if(err.message=="Validation error")
						return resp.status(400).send("Ya hay un usuario con este email.").end();
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
