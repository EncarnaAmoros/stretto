var express = require('express');
var app = express();
var path = require('path');

//Parte SPA, que envía al cliente HTML+JS "estáticos". El JS pide los datos y actualiza la interfaz
var express = require('express');
var app = express();

//app.use('/aplicacion/', express.static('public'));
app.use('/', express.static('public'));

// redirect all others to the index (HTML5 history)
app.use("*",function(req,res){
	res.sendFile(path.join(__dirname, '/public', 'movil.html'));
   // res.sendFile(path.join(__dirname,"public/index.html"));
});

var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Stretto app listening at http://%s:%s', host, port);
});