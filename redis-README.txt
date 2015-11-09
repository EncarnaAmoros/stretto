Pasos seguidos para utilizar redis en Windows:

1. Descargamos redis para Windows y lo instalamos

2. Instalamos redis en la raiz del proyecto con el comando:
	npm install redis --save

3. Buscamos la carpeta donde se ha guardado redis y ejecutamos el servidor (un archivo .exe)

4. Redis por defecto utiliza la IP:127.0.0.1 y el puerto: 6379 
   (se puede cambiar al crear el cliente de redis en el archivo js donde se utilice)

Ya tenemos el servidor redis en funcionamiento y esperando solicitudes.

5. Utilizamos redis en el fichero ./routes/checkAuth.js de nuestro proyecto para guardar el email 
   y password de un usuario que uitilice el API y poder recuperarlos para futuras comprobaciones
   de autorizaciones, para tener una mayor velocidad que cuando buscamos email y password en la BD

6. Algunos m�todos:
	Teniendo -> var redis  = require('redis'), client = redis.createClient();
	client.on("connect", callback) -> para realizar acciones cuando nos hemos conectado bien a redis
	client.on("error", callback) -> para realizar acciones cuando hay error al conectar con redis
	client.get(<clave>, callback) -> as� podemos localizar una clave y su valor
	client.set(<clave>, <valor>) -> para almacenar una clave y su valor
	client.del(<clave>, callback) -> para eliminar una clave y su valor