//Parte SPA, que envía al cliente HTML+JS "estáticos". El JS pide los datos y actualiza la interfaz
var express = require('express');
var app = express();

app.use('/web', express.static('web'));


//También se pueden renderizar ALGUNAS cosas desde el servidor, por ser más eficiente
var API_SERVER = 'http://localhost:3000/api/'
var LISTA_ITEMS = API_SERVER + 'items';

var request = require('request');

app.set('view engine', 'html');
app.engine('html', require('hbs').__express); 

app.get('saludo.html', function(pet, resp){
	resp.render('saludo', {saludo: 'Qué tal, Handlebars'})
});

app.get('index_server.html', function(pet, resp) {
	request(LISTA_ITEMS, function(error, resp_api, body_api){
		resp.render('index_server', {items: JSON.parse(body_api)})
	});
});



app.listen(4000, function(){
	console.log("Web Express en el puerto 4000");
});

