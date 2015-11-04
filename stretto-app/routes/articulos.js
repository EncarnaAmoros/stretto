var express = require('express');
var router = express.Router();
var models = require('../models');
var check = require('./checkAuth');

var numArticulosInicio = 10;

/* GET lista de artículos con paginado */

router.get('/', function(pet, resp){
	//Parte variable de la url
	var urlpage="?page=";
	//Si estamos en la primera página self = primera pagina
	//Si no, self es el numero de página de la url
	if(pet.query.page==undefined) {
		var pag = 1;
		var self = "";
	} else {
		var pag = parseInt(pet.query.page);
		var self = urlpage + pag;
	}
	//Número artículo desde el que empezamos a mirar
	var from = ((pag-1)*numArticulosInicio);
	//Buscamos en la BD y devolvemos el resultado paginado
	models.Articulo.findAll({
		offset: from,
		limit: numArticulosInicio
	}).then(function(articulos){
		models.Articulo.count().then(function(cantidad){
			//Si solo existe una página next=last y prev=last
			if(cantidad<numArticulosInicio) {
				var last, next, prev = "";
			} else {
				//Ultima página = cantidad art/cuantos art caben por pag +1
				if(cantidad%numArticulosInicio!=0) var last = urlpage + (Math.floor(cantidad/numArticulosInicio)+1);
				else var last = urlpage + (Math.floor(cantidad/numArticulosInicio));
				//Si busca un número de página donde ya no hay artículos -> 404
				if(pet.query.page>last.replace(urlpage,""))
					return resp.status(404).send('Recurso no encontrado').end();
				//Si estamos en la primera página prev igual a ella
				//Si no igual a pagina url - 1
				if(pag==1) prev = "";
				else prev = urlpage + (pag - 1);
				//Si estamos en la ultima página next igual a ella
				//Si no igual a pagina url + 1
				if(pag==last.replace(urlpage,"")) next = urlpage + last.replace(urlpage,"");
				else next = urlpage + (pag + 1);
			}
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
// Mostraremos los datos de un artículo:
// nombre, descipción, foro, precio, valoración 
// y el usuario que lo pone en venta.

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
