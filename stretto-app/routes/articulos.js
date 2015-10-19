var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET lista de artículos */

router.get('/', function(pet, resp){
	models.Articulo.findAll().then(function(results){
		resp.send(results);
	});
})

/* GET de un artículo */

router.get('/:id', function(pet, resp){
	models.Articulo.findById(pet.params.id).then(function(result){
			if(result == undefined ) {
				resp.status(404).jsonp('No existe el artículo referido.');
				return;
			}
      resp.status(200).jsonp(result);
	});
})

/* POST para crear artículos */

router.post('/', function(pet, resp){       
		models.Articulo.create({
				nombre: pet.body.nombre,
				descripcion: pet.body.descripcion,
				foto: pet.body.foto,
				precio: pet.body.precio,
				TipoId: pet.body.tipo
		}).then(function() {
				resp.status(200).jsonp("Operación realizada con éxito.");
		}).catch(function (err) {
  		//Transaction has been rolled back
			//err is whatever rejected the promise chain returned to the transaction callback
				resp.status(400).jsonp(err.message);
		});  
})

/* PUT para actualizar artículos */

router.put('/:id', function(pet, resp){
		models.Articulo.findById(pet.params.id).then(function(result){
  		if(result == undefined ) {
				resp.status(404).jsonp('No existe el artículo referido.');
				return;
			} 
		}).then(function() {
				models.Articulo.update({   
						nombre: pet.body.nombre,
						descripcion: pet.body.descripcion,
						foto: pet.body.foto,
						precio: pet.body.precio,
						TipoId: pet.body.tipo
				}, { where: {id : pet.params.id}}
				).then(function() {
						resp.status(200).jsonp("Operación realizada con éxito.");
				}).catch(function (err) {
						resp.status(400).jsonp(err.message);
				});
		});
})

/* DELETE para eliminar artículos */

router.delete('/:id', function(pet, resp){
		models.Articulo.findById(pet.params.id).then(function(result){
  		if(result == undefined ) {
				resp.status(404).jsonp('No existe el artículo referido.');
				return;
			} 
		}).then(function() {
				models.Articulo.destroy({
						where: {
								id : pet.params.id
						}
				}).then(function() {
						resp.status(200).jsonp("Operación realizada con éxito.");
				}).catch(function (err) {
						resp.status(400).jsonp(err.message);
				});
		});
    
})

module.exports = router;
