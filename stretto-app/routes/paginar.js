var express = require('express');
var selff, prevv, nextt, lastt;

exports.inicializarVariables = function (urlpage, pet, cantidad, numArticulosInicio) {
	//Parte variable de la url
	var urlpage="?page=";
	//Si estamos en la primera página self = primera pagina
	//Si no, self es el numero de página de la url
	if(pet.query.page==undefined) {
		var pag = 1;
		var self = "";
	} else {
		var pag = parseInt(pet.query.page);
		var self = urlpage + pag;
	}
	//Si solo existe una página next=last y prev=last
	if(cantidad<numArticulosInicio) {
		var last, next, prev = "";
	} else {
		//Ultima página = cantidad art/cuantos art caben por pag +1
		if(cantidad%numArticulosInicio!=0) var last = urlpage + (Math.floor(cantidad/numArticulosInicio)+1);
		else var last = urlpage + (Math.floor(cantidad/numArticulosInicio));
		//Si busca un número de página donde ya no hay artículos -> 404
		if(pet.query.page>last.replace(urlpage,""))
			return resp.status(404).send('Recurso no encontrado').end();
		//Si estamos en la primera página prev igual a ella
		//Si no igual a pagina url - 1
		if(pag==1) prev = "";
		else prev = urlpage + (pag - 1);
		//Si estamos en la ultima página next igual a ella
		//Si no igual a pagina url + 1
		if(pag==last.replace(urlpage,"")) next = urlpage + last.replace(urlpage,"");
		else next = urlpage + (pag + 1);
	}
	this.selff = self;
	this.prevv = prev;
	this.nextt = next;
	this.lastt = last;
}

//Para poder obtener las variables desde fuera
exports.self = function() { return this.selff; }
exports.prev = function() { return this.prevv; }
exports.next = function() { return this.nextt; }
exports.last = function() { return this.lastt; }