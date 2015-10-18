var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET lista de usuarios */

router.get('/', function(pet, resp){
	models.Articulo.findAll().then(function(results){
		resp.send(results);
	});
})

router.post('/', function(pet, resp){       
    models.Articulo.create({
        nombre: pet.body.username,
        descripcion: pet.body.descripcion,
        foto: pet.body.foto,
        precio: pet.body.precio,
        TipoId: pet.body.categoria
    }).then(function(err) {
        console.log('Artículo creado: '+pet.body.username);
        resp.status(200).jsonp("Bien");
    });
    
})

router.put('/:id', function(pet, resp){       
    models.Articulo.update({   
        nombre: pet.body.username,
        descripcion: pet.body.descripcion,
        foto: pet.body.foto,
        precio: pet.body.precio,
        TipoId: pet.body.categoria
    }, { where: {id : pet.params.id}}
    ).then(function(err) {
        console.log('Artículo actualizado: '+pet.body.username);
        resp.status(200).jsonp("Bien");
    });
    
})

router.delete('/:id', function(pet, resp){       
    models.Articulo.destroy({
        where: {
            id : pet.params.id
        }
        //,truncate: true
    }).then(function(err) {
        console.log('Artículo eliminado con id: '+pet.params.id);
        resp.status(200).jsonp("Bien");
    });
    
})

module.exports = router;
