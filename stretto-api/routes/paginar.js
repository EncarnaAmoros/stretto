var express = require('express');
var selff, prevv, nextt, lastt, errorr;

exports.inicializarVariables = function (url, urlpage, pet, cantidad, numItems) {
	//Si busca un número de página donde ya no hay artículos -> 404	
	if(pet.query.page>(parseInt(cantidad/numItems)+1))
		return this.errorr = true;
	var self, prev, next, last;
	//Si no hay datos es la misma url siempre
	if(cantidad==0) {
		this.selff = url+"";
		this.prevv = url+"";
		this.nextt = url+"";
		this.lastt = url+"";
		return;
	}
	//Si estamos en 1ªpágina self = 1ªpagina, si no, self = numero pág url
	if(pet.query.page==undefined) {
		var pag = 1;
		var self = "";
	} else {
		var pag = parseInt(pet.query.page);
		var self = urlpage + pag;
	}
	//Si solo existe una página next=last y prev=last
	if(cantidad<numItems) {
		last = next = prev = "";
	} else {
		//Ultima página = cantidad art/cuantos art caben por pag +1
		if(cantidad%numItems!=0) var last = urlpage + (Math.floor(cantidad/numItems)+1);
		else var last = urlpage + (Math.floor(cantidad/numItems));
		//Si estamos en la primera página prev igual a ella
		//Si no igual a pagina url - 1
		if(pag==1) prev = "";
		else prev = urlpage + (pag - 1);
		//Si estamos en la ultima página next igual a ella
		//Si no igual a pagina url + 1
		if(pag==last.replace(urlpage,"")) next = urlpage + last.replace(urlpage,"");
		else next = urlpage + (pag + 1);
	}
	
	//Si estamos en la primera página no habrá enlace prev
	if(prev=="") this.prevv = prev = "";
	else if(prev==urlpage+1) this.prevv = prev = url
	else this.prevv = url+prev;
	//Si estamos en la ultima página no habrá enlace next
	if(next==self && next==last) this.nextt = next = "";
	else this.nextt = url+next;
	this.selff = url+self;
	this.lastt = url+last;
}

//Para poder obtener las variables desde fuera
exports.self = function() { return this.selff; }
exports.prev = function() { return this.prevv; }
exports.next = function() { return this.nextt; }
exports.last = function() { return this.lastt; }
//Debemos volver a dejar el error como false
//Solo volverá a true si en la función se asigna
exports.error = function() { 
	var resultado = this.errorr;
	this.errorr = false;
	return resultado; 
}