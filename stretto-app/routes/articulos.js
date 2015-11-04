var express = require('express');
var router = express.Router();
var models = require('../models');

//Comprobar autorización
var check = require('./checkAuth');
//Variables para paginar
var paginar = require('./paginar');
//Artículos por página
var numArticulosPag = 10;


/* GET lista de artículos con paginado */

router.get('/', function(pet, resp){
	//Buscamos en la BD y devolvemos el resultado paginado
	models.Articulo.findAll({
		offset: ((pet.query.page-1)*numArticulosPag),
		limit: numArticulosPag
	}).then(function(articulos){
		models.Articulo.count().then(function(cantidad){
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
						href: "http://localhost:3000/stretto/articulos"+self
					},
					first: {
						href: "http://localhost:3000/stretto/articulos"
					},
					prev: {
						href: "http://localhost:3000/stretto/articulos"+prev
					},
					next: {
						href: "http://localhost:3000/stretto/articulos"+next
					},
					last: {
						href: "http://localhost:3000/stretto/articulos"+last
					}
				},
				count: articulos.length,
				total: cantidad,
				data: articulos
			});
  	});
	});
});

/* GET de un artículo */

router.get('/:id', function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		return resp.status(400).send('Identificador de artículo inválido.').end();
	models.Articulo.findById(pet.params.id).then(function(result){
		if(result == undefined )
			return resp.status(404).send('No existe el artículo referido.').end();
		resp.status(200).send(result);
	});	
});

/* POST para crear artículos */

router.post('/', check.checkAuth, function(pet, resp){
	var loginstr=new Buffer(pet.headers.authorization.split(' ')[1], 'base64').toString('ascii').split(':');
	models.Usuario.findAll ({
		where: { email: loginstr[0] }
	}).then(function(usuarios) {
		models.Articulo.create({
				nombre: pet.body.nombre,
				descripcion: pet.body.descripcion,
				foto: pet.body.foto,
				precio: pet.body.precio,
				TipoNombre: pet.body.tipo,
				UsuarioId: usuarios[0].id
		}).then(function(resultado) {
				resp.location('http://localhost:3000/stretto/articulos/' + resultado.id);
				resp.status(201).send("Operación realizada con éxito.");
		}).catch(function (err) {
				if(pet.body.tipo=='' || pet.body.tipo==undefined)	
					return resp.status(400).send('El tipo debe rellenarse.').end;
				else
						resp.status(400).send('El tipo de instrumento no se reconoce.');
		});
	});
});

/* PUT para actualizar artículos */

router.put('/:id', check.checkAuth, function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		return resp.status(400).send('Identificador de artículo inválido.').end();
	models.Articulo.findById(pet.params.id).then(function(result){
		if(result == undefined)
			return resp.status(404).send('No existe el artículo referido.').end();
		var loginstr=new Buffer(pet.headers.authorization.split(' ')[1], 'base64').toString('ascii').split(':');
		models.Usuario.findAll ({
			where: { email: loginstr[0] }
		}).then(function(usuarios) {
				models.Articulo.update({
					nombre: pet.body.nombre,
					descripcion: pet.body.descripcion,
					foto: pet.body.foto,
					precio: pet.body.precio,
					TipoNombre: pet.body.tipo,
					UsuarioId: usuarios[0].id
				}, { 
					where: {id : pet.params.id}
				}).then(function() {
						resp.status(204).send("Operación realizada con éxito.");
				}).catch(function (err) {
						if(pet.body.tipo=='' || pet.body.tipo==undefined)	
							return resp.status(400).send('El tipo debe rellenarse.').end;
						else
								resp.status(400).send('El tipo de instrumento no se reconoce.');
				});
		});
	});
});

/* DELETE para eliminar artículos */

router.delete('/:id', check.checkAuth, function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		return resp.status(400).send('Identificador de artículo inválido.').end();
	models.Articulo.findById(pet.params.id).then(function(result){
		if(result == undefined )
			return resp.status(404).send('No existe el artículo referido.').end();
		models.Articulo.destroy({
				where: {
						id : pet.params.id
				}
		}).then(function() {
				resp.status(204).send("Operación realizada con éxito.");
		}).catch(function (err) {
				resp.status(400).send(err.message);
		});
	});
});

module.exports = router;
