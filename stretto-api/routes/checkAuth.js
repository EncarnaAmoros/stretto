var express = require('express');
//var redis = require('redis');
var models = require('../models');

//comprueba la autorización
exports.checkAuth = function (pet, resp, next) {
	//Si el auth está vacio
	if(pet.headers.authorization==undefined) {
		resp.status(401)
		resp.setHeader('WWW-Authenticate', 'Basic realm="Necesitas iniciar sesión"');
		resp.send("Debes autentificarte.").end();
	}
	else {
		var redis  = require('redis'),
    client = redis.createClient(); // si IP o PUERTO cambian .createClient('127.0.0.1','3000');
		//Si conecta bien procedemos
		client.on("connect", function() {
			//Obtenemos email y password del auth
			var loginstr=new Buffer(pet.headers.authorization
													.split(' ')[1], 'base64')
													.toString('ascii').split(':');
			//Miramos si tenemos dicho email guardado en redis (o client.exists)
			client.get(loginstr[0], function (err, reply) {
				//Si está guardado es porque ya lo encontró antes en la BD y guardó en redis
				if(reply!=null) {
					next();
				} else {
					//Si no lo tenemos guardado lo creamos si está en la BD
					models.Usuario.findAll({
						where: {
							email: loginstr[0],
							password: loginstr[1]
						}
					}).then(function(results) {
							//Si no está en la BD autentificación incorrecta
							if(results[0]==undefined) {
								resp.status(403);
								resp.send("Email o contraseña incorrectos.").end();
							} else {
								//Si está en la BD lo guardamos en redis
								client.set(loginstr[0], loginstr[1]);
								next();
							}
					});
				}
			});			
		});	
		//Si hay error al contectar con servidor redis
		client.on("error", function (err) {
			resp.status(500);
			resp.send("Ha habido este error \n " + err).end();
		});
	}	
}

//Elimina la clave pasada por parámetro y su valor
exports.deleteAuth = function(email) {
	var redis  = require('redis'),
  client = redis.createClient();
	//Si se conecta eliminamos la clave-valor
	client.on("connect", function() {
		client.del(email, function(err, reply) {
		});
	});
	//Si hay error al contectar con servidor redis
	client.on("error", function (err) {
		resp.status(500);
		resp.send("Ha habido este error \n " + err).end();
	});
}