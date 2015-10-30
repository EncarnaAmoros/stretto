var express = require('express');
var router = express.Router();
var models = require('../models');
var check = require('./checkAuth');

/* GET lista de usuarios */

router.get('/', function(pet, resp, err){
	models.Usuario.findAll().then(function(results){
		resp.status(200).send(results);
	});
});

/* GET de un usuario */

router.get('/:id', function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		resp.status(400).send('Identificador de usuario inválido.').end();
	models.Usuario.findById(pet.params.id).then(function(result){
		if(result == undefined )
			resp.status(404).send('No existe el usuario referido.').end();
		else
			resp.status(200).send(result).end();
	});
});

/* GET lista de artículos según usuario */

router.get('/:id_u/articulos', function(pet, resp){
	if(isNaN(Number(pet.params.id_u)))
		resp.status(400).send('Identificador de usuario inválido.').end();
	models.Usuario.findById(pet.params.id_u).then(function(usuario){
		if(usuario == undefined )
			resp.status(404).send('No existe el usuario referido.').end();
		usuario.getArticulos().then(function(results){
			resp.status(200).send(results).end();
		});
	});
});

/* POST para crear usuarios */

router.post('/', function(pet, resp){ 
	if(pet.body.email==undefined || pet.body.email=='')
		resp.status(400).send('El email es obligatorio.').end();
	models.Usuario.create({
		email: pet.body.email,
		password: pet.body.password,
		valoracion: pet.body.valoracion,
		nombre: pet.body.nombre,
		tlf: pet.body.tlf
	}).then(function(resultado) {
			resp.location('http://localhost:3000/stretto/Usuarios/' + resultado.id);
			resp.status(201).send("Operación realizada con éxito.").end();
	}).catch(function (err) {
			//err is whatever rejected the promise chain returned to the transaction callback
			resp.status(400).send(err.message).end();
	});
});

/* PUT para actualizar usuario */

router.put('/:id', check.checkAuth, function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		resp.status(400).send('Identificador de usuario inválido.').end();
	models.Usuario.findById(pet.params.id).then(function(result){
		if(result == undefined ) {
			resp.status(404).send('No existe el usuario referido.').end();
		} else {
			if(pet.body.email==undefined || pet.body.email=='')
				resp.status(400).send('El email es obligatorio.').end();
			models.Usuario.update({   
				email: pet.body.email,
				password: pet.body.password,
				valoracion: pet.body.valoracion,
				nombre: pet.body.nombre,
				tlf: pet.body.tlf
			}, { 
				where: {id : pet.params.id}
			}).then(function() {
					resp.status(204).send("Operación realizada con éxito.").end();
			}).catch(function (err) {
					resp.status(400).send(err.message).end();
			});
		}
	});
});

		
/* DELETE para eliminar usuarios */

router.delete('/:id', check.checkAuth, function(pet, resp){
	if(isNaN(Number(pet.params.id)))
		resp.status(400).send('Identificador de usuario inválido.').end();
	models.Usuario.findById(pet.params.id).then(function(result){
		if(result == undefined )
			resp.status(404).send('No existe el usuario referido.').end();
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
