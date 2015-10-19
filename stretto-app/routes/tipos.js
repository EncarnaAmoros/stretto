var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET lista de tipos según tipo */

router.get('/:param_tipo/articulos', function(pet, resp){
		models.Tipo.findById(pet.params.param_tipo).then(function(result){
  		if(result == undefined ) {
				resp.status(404).jsonp('No existe el tipo referido.');
				return;
			} 
		}).then(function() {	
				models.Articulo.findAll({
				where: {
					TipoId: pet.params.param_tipo
				}
				}).then(function(results){
					resp.send(results);
				});

				//Otra forma
				/*models.Tipo.findById(pet.params.tipo).then(function(tip){
					return tip.getArticulos();
				}).then(function(results){
					resp.send(results)
				});*/ 
		});
    
})

/* GET de tipos */

router.get('/', function(pet, resp) {
	models.Tipo.findAll().then(function(results){
        resp.status = 200;
		resp.send(results);
	});
})

/* POST para creación temporal de tipos para probar API */

router.post('/', function(pet, resp) {     
    models.Tipo.create({
        id: pet.body.nombre
    }).then(function() {
				resp.status(200).jsonp("Operación realizada con éxito.");
		}).catch(function (err) {
				resp.status(400).jsonp(err.message);
		});
})

module.exports = router;
