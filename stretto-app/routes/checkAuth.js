var express = require('express');
//var redis = require('redis');
var models = require('../models');

exports.checkAuth = function (pet, resp, next) {
	if(pet.headers.authorization==undefined) {
		resp.status(401)
		resp.setHeader('WWW-Authenticate', 'Basic realm="Necesitas iniciar sesión"');
		resp.send("Debes autentificarte").end();
	}
	else {
		var redis  = require('redis'),
    client = redis.createClient(); // si IP o PUERTO cambian .createClient('127.0.0.1','3000');
		client.on("connect", function() {
			var loginstr=new Buffer(pet.headers.authorization
													.split(' ')[1], 'base64')
													.toString('ascii').split(':');
			console.log("Intenta entrar: "+loginstr[0]+" y: "+loginstr[1]);
			//Si hay error al contectar con servidor redis
			client.on("error", function (err) {
				console.log("Ha habido este error \n " + err);
			});
			//Miramos si tenemos dicho email guardado en redis (o client.exists)
			client.get(loginstr[0], function (err, reply) {
				//Si está guardado es porque ya lo encontró antes en la BD y guardó en redis
				console.log("Miraaa reply:"+reply);
				if(reply!=null) {
					console.log("Ya lo teníamos guardado en rendis");
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
								console.log("No lo teníamos guardado en rendis, guardamos en la BD");
								client.set(loginstr[0], loginstr[1]);
								//Tiempo en que expira en redis = 5 segundos
								//client.expire(loginstr[0], 5);
								next();
							}
					});
				}
			});			
		});	
	}	
}

/**
exports.checkAuth = function (pet, resp, next) {
	if(pet.headers.authorization==undefined) {
		resp.status(401)
		resp.setHeader('WWW-Authenticate', 'Basic realm="Necesitas iniciar sesión"');
		resp.send("Debes autentificarte").end();
	}
	else {
		var redis  = require('redis'),
    client = redis.createClient(); //o para otra IP y puerto redis.createClient('127.0.0.1','3000');
		client.on("connect", function() {
			var loginstr=new Buffer(pet.headers.authorization
													.split(' ')[1], 'base64')
													.toString('ascii').split(':');
			console.log("Intenta entrar: "+loginstr[0]+" y: "+loginstr[1]);
			//Si hay un error al contectar con el servidor redis
			client.on("error", function (err) {
				console.log("Ha habido este error \n " + err);
			});
			//Miramos si tenemos dicho email guardado en redis (o client.exists)
			client.exists(loginstr[0], function (err, reply) {
				console.log("mira reply:"+reply);
				//Si está guardado es porque ya lo encontró antes en la BD y guardó en redis
				console.log("Ya lo teníamos guardado en rendis");
				next();
				return;
			});			
			//Si no lo tenemos guardado lo creamos si está en la BD
			models.Usuario.findAll({
				where: {
					email: loginstr[0],
					password: loginstr[1]
				}
			}).then(function(results) {
					//Si no está en la BD autentifiación incorrecta
					if(results[0]==undefined) {
						resp.status(403);
						resp.send("Email o contraseña incorrectos.").end();
					} else {
						//Si está en la BD lo guardamos en redis
						console.log("No lo teníamos guardado en rendis, guardamos en redis");
						client.set(loginstr[0], loginstr[1]);
						//Tiempo en que expira en redis = 15 segundos
						//client.expire(loginstr[0], 15);
						next();
					}
			});	
		});	
	}	
}
**/