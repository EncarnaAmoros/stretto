var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET lista de usuarios */

router.get('/', function(pet, resp){
	models.Articulo.findAll().then(function(results){
		resp.send(results);
	});
})

router.put('/', function(pet, resp){
	console.log(pet.body);        
    models.Articulo.create({
        username: pet.body.username,
        descripcion: pet.body.descripcion,
        foto: pet.body.foto,
        precio: pet.body.precio
    }).then(function(err) {
        console.log('Artículo creado: '+pet.body.username);
        resp.status(200).jsonp("bien");
    });
    

    
})

module.exports = router;
