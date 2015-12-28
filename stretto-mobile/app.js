var express = require('express');
var app = express();
var path = require('path');

//app.use('/aplicacion/', express.static('public'));
app.use('/', express.static('public'));

// redirect all others to the index (HTML5 history)
app.use("*",function(req,res){
	res.sendFile(path.join(__dirname, '/public', 'movil.html'));
   // res.sendFile(path.join(__dirname,"public/index.html"));
});

// PUSH NOTIFICATIONS


var bodyParser = require('body-parser')
var unirest = require('unirest');

//Almacenamos en memoria los ids de los usuarios que quieren notificaciones. 
//Normalmente se haría en una BD, ¡es solo un ejemplo!
var mapIds = new Map();

//Almacenamos también en memoria las notificaciones a enviar. Solo guardamos la última
var ultimaNotificacion = {
  'titulo': 'Notificación push', 
  'contenido':'Hola k ase?'
};


app.post('/api/suscripciones', function(pet, resp){
	var id = pet.body.id;
	mapIds.set(id, id);
	resp.status(201);
	resp.send('creada suscripción para id: ' + id);
});


app.delete('/api/suscripciones/:id', function(pet, resp){
	var id = pet.params.id;
	if (mapIds.has(id)) {
	  mapIds.delete(id);
		resp.status(200);
		resp.send('Eliminada suscripción');
	}
	else {
		resp.status(404);
		resp.send('No existe la suscripción con id: ' + id);
	}
});

var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';
var GOOGLE_API_KEY = 'AIzaSyCEhXPlHLVhumxI2zsSAzbPRL-grFUBK0c'; 

//curl --header "Authorization: key=AIzaSyCEhXPlHLVhumxI2zsSAzbPRL-grFUBK0c" --header "Content-Type: application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"cBYSNzsdttI:APA91bHWqoKDZp-EDUg40m__J5DkpmKmGZmA6aU_8w0f_3NSqewbDoczDLvgPtoWdxoQ1-akhbsbzQYUXX13beORqzDS_lzKtSJzQz_PEdmhXoMOLfw97Q2MvNxIMRJKyf7TMnbTuO1m\"]}"

app.post('/api/notificaciones', function(pet, resp) {
	var titulo = pet.body.titulo;
	var contenido = pet.body.contenido;
	if (titulo && contenido) {
		ultimaNotificacion.titulo = titulo;
		ultimaNotificacion.contenido = contenido;
		//ahora tenemos que enviar la notificación a GCM
		//para que este la reenvíe a los clientes suscritos
		var lista_ids = [];
		for (var k of mapIds.keys()) {
			lista_ids.push(mapIds.get(k));
		}
		var json_body = {registration_ids: lista_ids};
		console.log(json_body);
		//hacemos la petición HTTP a GCM
		unirest.post(GCM_ENDPOINT)
			.headers({'Authorization': 'key=' + GOOGLE_API_KEY})
			.type('json')
			.send(json_body)
			.end(function(response) {
				resp.status(response.status);
				resp.send(response);
			});
	}
	else {
		resp.status(400);
		resp.send('Datos incorrectos para crear la notificación');
	}
		
});

app.get('/api/notificaciones/ultima', function(pet, resp) {
	resp.status(200);
	resp.send(JSON.stringify(ultimaNotificacion));
});

// SERVIDOR

var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Stretto app listening at http://%s:%s', host, port);
});