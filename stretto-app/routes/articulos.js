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
	models.Articulo.findById(pet.params.id).then(function(t){
		return t;
	}).then(function(result) {
        resp.send(result);
    });
    /*models.Tipo.findById(pet.params.tipo).then(function(tip){
		return tip.getArticulos();
	}).then(function(results){
		resp.send(results)
	});*/ 
})

/* POST para crear artículos */

router.post('/', function(pet, resp){       
    models.Articulo.create({
        nombre: pet.body.nombre,
        descripcion: pet.body.descripcion,
        foto: pet.body.foto,
        precio: pet.body.precio,
        TipoId: pet.body.tipo
    }).then(function(err) {
        console.log('Artículo creado: ' + pet.body.nombre);
        resp.status(200).jsonp("Bien");
    });
    
})

/* PUT para actualizar artículos */

router.put('/:id', function(pet, resp){       
    models.Articulo.update({   
        nombre: pet.body.nombre,
        descripcion: pet.body.descripcion,
        foto: pet.body.foto,
        precio: pet.body.precio,
        TipoId: pet.body.tipo
    }, { where: {id : pet.params.id}}
    ).then(function(err) {
        console.log('Artículo actualizado: ' + pet.body.nombre);
        resp.status(200).jsonp("Bien");
    });
    
})

/* DELETE para eliminar artículos */

router.delete('/:id', function(pet, resp){       
    models.Articulo.destroy({
        where: {
            id : pet.params.id
        }
    }).then(function(err) {
        console.log('Artículo eliminado id: ' + pet.params.id);
        resp.status(200).jsonp("Bien");
    });
    
})

module.exports = router;
