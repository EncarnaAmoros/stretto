var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET lista de artículos */

router.get('/', function(pet, resp){
	models.Articulo.findAll().then(function(results){
		resp.status(200).send(results);
	});
});

/* GET de un artículo */

router.get('/:id', function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		resp.status(400).send('Identificador de artículo inválido.').end();
	models.Articulo.findById(pet.params.id).then(function(result){
		if(result == undefined )
			resp.status(404).send('No existe el artículo referido.').end();
		resp.status(200).send(result);
	});
	
});

/* POST para crear artículos */

router.post('/', function(pet, resp){       
	models.Articulo.create({
			nombre: pet.body.nombre,
			descripcion: pet.body.descripcion,
			foto: pet.body.foto,
			precio: pet.body.precio,
			TipoNombre: pet.body.tipo,
			UsuarioId: pet.body.usuario
	}).then(function(resultado) {
			resp.location('http://localhost:3000/stretto/articulos/' + resultado.id);
			resp.status(201).send("Operación realizada con éxito.");
	}).catch(function (err) {
			//err is whatever rejected the promise chain returned to the transaction callback
			resp.status(400).send('Tipo y usuario deben rellenarse');
	});  
})

/* PUT para actualizar artículos */

router.put('/:id', function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		resp.status(400).send('Identificador de artículo inválido.').end();
	models.Articulo.findById(pet.params.id).then(function(result){
		if(result == undefined )
			resp.status(404).send('No existe el artículo referido.').end();
		models.Articulo.update({
			nombre: pet.body.nombre,
			descripcion: pet.body.descripcion,
			foto: pet.body.foto,
			precio: pet.body.precio,
			TipoNombre: pet.body.tipo,
			UsuarioId: pet.body.usuario
		}, { 
			where: {id : pet.params.id}
		}).then(function() {
				resp.status(204).send("Operación realizada con éxito.");
		}).catch(function (err) {
				resp.status(400).send('Tipo y usuario deben rellenarse');
		});
	});
});

/* DELETE para eliminar artículos */

router.delete('/:id', function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		resp.status(400).send('Identificador de artículo inválido.').end();
	models.Articulo.findById(pet.params.id).then(function(result){
		if(result == undefined )
			resp.status(404).send('No existe el artículo referido.').end();
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
