Pasos seguidos para utilizar redis en Windows:

1. Descargamos redis para Windows

2. Instalamos redis

3. Buscamos la carpeta donde se ha guardado redis y ejecutamos el servidor (un archivo .exe)

4. Redis por defecto utiliza la IP:127.0.0.1 y el puerto: 6379 
   (se puede cambiar al crear el cliente de redis en el archivo js donde se utilice)

Ya tenemos el servidor redis en funcionamiento y esperando solicitudes.

5. Utilizamos redis en el fichero ./routes/checkAuth.js de nuestro proyecto para guardar el email 
   y password de un usuario que uitilice el API

6. Algunos métodos:
	Teniendo -> var redis  = require('redis'), client = redis.createClient();
	client.on("connect", callback) -> para realizar acciones cuando nos hemos conectado bien a redis
	client.on("error", callback) -> para realizar acciones cuando hay error al conectar con redis
	client.get(<clave>, callback) -> así podemos localizar una clave y su valor
	client.set(<clave>, <valor>) -> para almacenar una clave y su valor
	client.del(<clave>, <valor>) -> para eliminar una clave y su valor