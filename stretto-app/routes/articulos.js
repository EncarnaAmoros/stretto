var express = require('express');
var router = express.Router();
var models = require('../models');
var check = require('./checkAuth');

/* GET lista de artículos */

router.get('/', function(pet, resp){
	models.Articulo.findAll(
		{limit: 10 }
	).then(function(results){
		var links = '';
		resp.status(200).send(results);
	});
});

/*
// Skip 8 instances/rows
Project.findAll({ offset: 8 })
// Skip 5 instances and fetch the 5 after that
Project.findAll({ offset: 5, limit: 5 })

"_links": {
"self": {
"href": "http://example.org/api/books?page=3"
},
"first": {
"href": "http://example.org/api/books"
},
"prev": {
"href": "http://example.org/api/books?page=2"
},
"next": {
"href": "http://example.org/api/books?page=4"
},
"last": {
"href": "http://example.org/api/books?page=133"
}
}
"count": 2,
"total": 498,
"data": {
{ title: "A Song of Ice and Fire", author: "George R.R. Martin"}
{ title: "To Your Scattered Bodies Go", author: "Philip J. Farmer"}
}
}*/


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
