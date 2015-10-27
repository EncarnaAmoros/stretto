var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET lista de usuarios */

router.get('/', function(pet, resp){
	models.Usuario.findAll().then(function(results){
		resp.status(200).send(results);
	});
});

/* GET de un usuario */

router.get('/:id', function(pet, resp){
	if(isNaN(Number(pet.params.id))) {
		resp.status(400).send('Identificador de usuario inválido.');
	} else {
		models.Usuario.findById(pet.params.id).then(function(result){
			if(result == undefined )
				resp.status(404).send('No existe el usuario referido.');
			else
				resp.status(200).send(result);
		});
	}
});

/* GET lista de artículos según usuario */

router.get('/:id_u/articulos', function(pet, resp){
	if(isNaN(Number(pet.params.id_u))) {
		resp.status(400).send('Identificador de usuario inválido.');
	} else {
		models.Usuario.findById(pet.params.id_u).then(function(usuario){
			if(usuario == undefined ) {
				resp.status(404).send('No existe el usuario referido.');
			} else {
					usuario.getArticulos().then(function(results){
						resp.status(200).send(results);
					});					
				}
		});
	}
});

/* POST para crear artículos */

router.post('/', function(pet, resp){ 
	if(pet.body.email=='') {
		resp.status(400).send('El email es obligatorio.');
	} else {
		models.Usuario.create({
			email: pet.body.email,
			password: pet.body.password,
			valoracion: pet.body.valoracion,
			nombre: pet.body.nombre,
			tlf: pet.body.tlf
		}).then(function(resultado) {
				resp.location('http://localhost:3000/stretto/Usuarios/' + resultado.id);
				resp.status(201).send("Operación realizada con éxito.");
		}).catch(function (err) {
				//err is whatever rejected the promise chain returned to the transaction callback
				resp.status(400).send(err.message);
		});
	}
});

/* PUT para actualizar usuario */

router.put('/:id', function(pet, resp){
	if(isNaN(Number(pet.params.id))) {
		resp.status(400).send('Identificador de usuario inválido.');
	} else {
			models.Usuario.findById(pet.params.id).then(function(result){
				if(result == undefined ) {
					resp.status(404).send('No existe el usuario referido.');
				} else {
					if(pet.body.email=='') {
						resp.status(400).send('El email es obligatorio.');
					} else {
						models.Usuario.update({   
							email: pet.body.email,
							password: pet.body.password,
							valoracion: pet.body.valoracion,
							nombre: pet.body.nombre,
							tlf: pet.body.tlf
						}, { 
							where: {id : pet.params.id}
						}).then(function() {
								resp.status(204).send("Operación realizada con éxito.");
						}).catch(function (err) {
								resp.status(400).send(err.message);
						});
					}
				}
		});
	}
});

/* DELETE para eliminar artículos */

router.delete('/:id', function(pet, resp){
	if(isNaN(Number(pet.params.id))) {
		resp.status(400).send('Identificador de usuario inválido.');
	} else {
		models.Usuario.findById(pet.params.id).then(function(result){
			if(result == undefined ) {
				resp.status(404).send('No existe el usuario referido.');
			} else {
				models.Usuario.destroy({
						where: {
								id : pet.params.id
						}
				}).then(function() {
						resp.status(204).send("Operación realizada con éxito.");
				}).catch(function (err) {
						resp.status(400).send(err.message);
				});	
			}
		});
	}
});

module.exports = router;
