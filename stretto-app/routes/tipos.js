var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET lista de tipos según tipo */

router.get('/:param_tipo/articulos', function(pet, resp){
	models.Tipo.findById(pet.params.param_tipo).then(function(result){
		if(result == undefined ) {
			resp.status(404).send('No existe el tipo referido.');
		} else {
			models.Articulo.findAll({
				where: {
					TipoNombre: pet.params.param_tipo
				}
			}).then(function(results){
				resp.status(200).send(results);
			});
				//Otra forma
				/*models.Tipo.findById(pet.params.tipo).then(function(tip){
					return tip.getArticulos();
				}).then(function(results){
					resp.send(results)
				});*/
		}
	});
});

/* GET de tipos */

router.get('/', function(pet, resp) {
	models.Tipo.findAll().then(function(results){
		resp.status(200).send(results);
	});
});

module.exports = router;
