//Lista de la compra que usa un Map de ES6 para almacenar los datos
var express = require('express');

var app = express();


//NUEVO práctica cliente: Habilitamos CORS para que se pueda acceder al API desde XMLHttpRequest
var cors = require('cors');
app.use(cors());

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var lista = [];
lista.push({id:1, nombre:"patatas"});
lista.push({id:2, nombre:"ron"});

var map = new Map();
map.set(1, {id:1, nombre:"patatas"});
map.set(2, {id:2, nombre:"arroz"});
var idActual = 3;


app.get('/api/items', function(pet, resp){
	var lista = [];
	for (var k of map.keys()) {
		lista.push(map.get(k));
	}
	resp.send(lista);
});

app.get('/api/items/:id', function(pet, resp){
	var id = parseInt(pet.params.id);
	var obj = map.get(id);
	if (!obj) {
		resp.status(404);
		resp.send('item ' + id + ' no encontrado');
	}
	else {
		resp.send(map.get(id));
	}
});


//Prueba:
//curl -d '{"nombre":"tomates"}' -H "Content-Type:application/json" -v http://localhost:3000/api/items
app.post('/api/items', function(pet, resp) {
	console.log(pet.body);
	var nuevo = pet.body
	if (nuevo.nombre) {
		var insertado = {id: idActual, nombre: nuevo.nombre};
		map.set(insertado.id, insertado);
		resp.status(201);
		resp.header('Location', 'http://localhost:3000/api/items/'+insertado.id);
		resp.send(insertado);
		idActual++;
	}
	else {
		resp.status(400);
		resp.send("El objeto no tiene campo nombre");
	}
	resp.end();
});

app.delete('/api/items/:id', function(pet, resp) {
	var id = parseInt(pet.params.id);
	if (!map.has(id)) {
		resp.status(404);
		resp.send('item ' + id + ' no encontrado');
	}
	else {
		resp.status(204);
		resp.send(map.get(id));
		map.delete(id);
	}

})

app.listen(3000, function(){
	console.log("API Express en el puerto 3000");
});