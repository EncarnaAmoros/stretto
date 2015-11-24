var express = require('express');
var router = express.Router();
var models = require('../models');

//Comprobar autorización
var auth = require('./checkAuth');
//Variables para paginar
var paginar = require('./paginar');
//Artículos por página
var numArticulosPag = 10;


/* GET lista de artículos con paginado */

router.get('/', function(pet, resp){
	if(pet.query.page==undefined && pet.url!="/")
		return resp.status(400).send("Falta el parámetro page en la petición").end();
	//Buscamos en la BD y devolvemos el resultado paginado
	models.Articulo.findAll({
		offset: ((pet.query.page-1)*numArticulosPag),
		limit: numArticulosPag,
		order: 'id DESC'
	}).then(function(articulos){
		models.Articulo.count().then(function(cantidad){
			//Obtenemos las variables para el paginado
			var url = "http://localhost:3000/stretto/articulos";
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

/* GET de un artículo */
/* Mostramos los datos del artículo y los datos relevantes del usuario que */
/* lo ha puesto en venta, es decir, su nombre e e-mail. El tipo lo sabemos */
/* pues la clave primaria está en el artículo y es el nombre (ej: cuerda)  */
/* Tampoco hace falta incluir su usuario entero, con nombre e email basta	 */

router.get('/:id', function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		return resp.status(400).send('Identificador de artículo inválido.').end();
	models.Articulo.findById(pet.params.id).then(function(articulo){
		if(articulo == undefined )
			return resp.status(404).send('No existe el artículo referido.').end();
		models.Usuario.findById(articulo.UsuarioId).then(function(usuario) {
			resp.status(200).send({
				data: articulo,
				usuario: {
					id: usuario.id,
					nombre: usuario.nombre,
					email: usuario.email
				}
			});
		});
	});	
});

/* POST para crear artículos */

router.post('/', auth.checkAuth, function(pet, resp){
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
		}).then(function(articulo) {
				resp.location('http://localhost:3000/stretto/articulos/' + articulo.id);
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

router.put('/:id', auth.checkAuth, function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		return resp.status(400).send('Identificador de artículo inválido.').end();
	models.Articulo.findById(pet.params.id).then(function(articulo){
		if(articulo == undefined)
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

router.delete('/:id', auth.checkAuth, function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		return resp.status(400).send('Identificador de artículo inválido.').end();
	models.Articulo.findById(pet.params.id).then(function(articulo){
		if(articulo == undefined )
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
