var express = require('express');
var models = require('../models');

exports.checkAuth = function (pet, resp, next) {
	if(pet.headers.authorization==undefined) {
		resp.status(401)
		resp.setHeader('WWW-Authenticate', 'Basic realm="Necesitas iniciar sesión"');
		resp.send("Debes autentificarte").end();
	}
	else {
		var loginstr=new Buffer(pet.headers.authorization
													.split(' ')[1], 'base64')
													.toString('ascii').split(':');
		console.log("Intenta entrar: "+loginstr[0]+" y: "+loginstr[1]);
		models.Usuario.findAll({
			where: {
					email: loginstr[0],
					password: loginstr[1]
				}
			}).then(function(results) {
					if(results[0]==undefined) {
						resp.status(403);
						resp.send("Email o contraseña incorrectos.").end();
					} else {
						next();
					}
			});
	}
}