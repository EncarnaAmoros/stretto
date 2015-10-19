var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET lista de tipos según tipo */

router.get('/:param_tipo/articulos', function(pet, resp){
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
    
})

/* GET temporal de tipos para probar API */

router.get('/', function(pet, resp){
	models.Tipo.findAll().then(function(results){
		resp.send(results);
	});
})

/* POST para creación temporal de tipos para probar API */

router.post('/', function(pet, resp){       
    models.Tipo.create({
        id: pet.body.nombre
    }).then(function(err) {
        console.log('Tipo creado: '+pet.body.nombre);
        resp.status(200).jsonp("Bien");
    });
})

module.exports = router;
