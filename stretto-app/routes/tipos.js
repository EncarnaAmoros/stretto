var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET lista de articulos según tipo */

router.get('/:param_tipo/articulos', function(pet, resp){
	models.Tipo.findById(pet.params.param_tipo).then(function(tipo){
		if(tipo == undefined )
			return resp.status(404).send('No existe el tipo referido.').end();
			/*//Otra forma
			models.Articulo.findAll({
			where: {
					TipoNombre: pet.params.param_tipo
				}
			}).*/
			tipo.getArticulos().then(function(results){
				resp.status(200).send(results);
			});
	});
});

/* GET de tipos */
/* Usaremos el get de tipos a la hora de crear un artículo */
/* para que el usuario que va a poner en venta un artículo */
/* escoja entre los tipos mostrados, no necesitamos más		 */

router.get('/', function(pet, resp) {
	models.Tipo.findAll().then(function(results){
		resp.status(200).send(results);
	});
});

module.exports = router;
